interface IHandler {
  [index: string]: (param: any, update: Function, dispatch: Function) => void;
}

interface IListener {
  [index: string]: (param: any) => void;
}

function error(format: string, ...args: string[]) {
  if (format === undefined) return;
  let argIndex = 0;
  format = format.replace(/%s/g, () => {
    if (args != undefined && argIndex < args.length) {
      return args[argIndex++];
    } else {
      return ``;
    }
  });
  throw new Error(format);
}

class Shared {
  listeners: IListener[] = [];
  cache = { data: {}, dispatch: {}, types: {} };
  handler: IHandler = {};

  constructor(param: IHandler, types: string[]) {
    this.handler = param;
    types.map(value => {
      this.cache.types[value] = {};
    });
  }

  needUpdate = (cache: any, action: string, param: any) => {
    if (param == undefined) return false;
    if (cache[action] != undefined) {
      if (cache[action] == param) return false;
      if (
        typeof param === `object` &&
        param.key != undefined &&
        cache[action].key == param.key
      ) {
        return false;
      }
    }
    cache[action] = param;
    return true;
  };

  update = (action: string, param: any) => {
    if (this.cache.types[action] == undefined) {
      error(`Shared.update: '%s' is unknown type`, action);
    }
    if (!this.needUpdate(this.cache.data, action, param)) return;
    this.listeners.map(listener => {
      if (this.cache.data[action] && listener[action]) {
        listener[action](param);
      }
    });
  };

  dispatch = (action: string, param: any) => {
    if (!this.needUpdate(this.cache.dispatch, action, param)) return;
    if (this.handler[action]) {
      this.handler[action](param, this.update, this.dispatch);
    }
  };

  register = (listener: IListener) => {
    if (listener != undefined) {
      this.listeners.push(listener);
    }
  };

  unregister = (listener: IListener) => {
    if (listener != undefined) {
      const i = this.listeners.indexOf(listener);
      if (i >= 0) {
        this.listeners.splice(i, 1);
      }
    }
  };
}

export function createShared(handler: IHandler, types: string[]) {
  return new Shared(handler, types);
}
