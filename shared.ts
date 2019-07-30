interface IHandler {
  [index: string]: (param: any, update: Function, dispatch: Function) => void;
}

interface IListener {
  [index: string]: (param: any) => void;
}

class Shared {
  listeners: IListener[] = [];
  cache = { data: {}, dispatch: {} };
  handler: IHandler = {};

  constructor(param: IHandler) {
    this.handler = param;
  }

  needUpdate = (cache: any, action: string, param: any) => {
    if (param == undefined) return false;
    if (cache[action] != undefined) {
      if (cache[action] == param) return false;
      if (
        typeof param === `object` &&
        param.key &&
        cache[action].key == param.key
      ) {
        return false;
      }
    }
    cache[action] = param;
    return true;
  };

  update = (action: string, param: any) => {
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

export function createShared(handler: IHandler) {
  return new Shared(handler);
}
