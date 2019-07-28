interface IHandler {
  [index: string]: (param: any, update: Function, dispatch: Function) => void;
}

interface IUpdater {
  [index: string]: (param: any) => void;
}

class Shared {
  updaters: IUpdater[] = [];
  data = { update: {}, dispatch: {} };
  handler: IHandler = {};

  constructor(param: IHandler) {
    this.handler = param;
  }

  update(action: string, param: any) {
    if (this.data.update[action] == param) return;
    this.data.update[action] = param;
    this.updaters.map(func => {
      if (this.data[action] && func[action]) {
        func[action](this.data.update[action]);
      }
    });
  }

  dispatch(action: string, param: any) {
    if (this.data.dispatch[action] == param) return;
    this.data.dispatch[action] = param;
    if (this.handler[action]) {
      this.handler[action](param, this.update, this.dispatch);
    }
  }

  register(updater: IUpdater) {
    if (updater) {
      this.updaters.push(updater);
    }
  }

  unregister(updater: IUpdater) {
    if (updater) {
      const i = this.updaters.indexOf(updater);
      if (i >= 0) {
        this.updaters.splice(i, 1);
      }
    }
  }
}

export function createShared(handler: IHandler) {
  return new Shared(handler);
}
