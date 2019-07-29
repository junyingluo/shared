interface IHandler {
  [index: string]: (param: any, update: Function, dispatch: Function) => void;
}

interface IListener {
  [index: string]: (param?: any) => void;
}

class Shared {
  listeners: IListener[] = [];
  cache = { data: {}, dispatch: {} };
  handler: IHandler = {};

  constructor(param: IHandler) {
    this.handler = param;
  }

  update = (action: string, param: any) => {
    if (this.cache.data[action] == param) return;
    this.cache.data[action] = param;
    this.listeners.map(listener => {
      if (this.cache.data[action] && listener[action]) {
        listener[action](this.cache.data[action]);
      }
    });
  };

  dispatch = (action: string, param: any) => {
    if (this.cache.dispatch[action] == param) return;
    this.cache.dispatch[action] = param;
    if (this.handler[action]) {
      this.handler[action](param, this.update, this.dispatch);
    }
  };

  register = (listener: IListener) => {
    if (listener) {
      this.listeners.push(listener);
    }
  };

  unregister = (listener: IListener) => {
    if (listener) {
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
