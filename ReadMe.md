# shared
shared the data between different modules

it can work with react or vue

# demo

// register 'updateQueryWord method' and it's triggered by `shared.update`
let shared = createShared({
  "updateQueryWord": (param: any, update: Function, dispatch: Function) => {
    // param  = "queryWord 1"
    update("queryWord", param);
  }
})

// register 'queryWord listener' and it's triggered by `shared.dispatch`
Store.register({
  "queryWord": (param: any) => {
    // queryWord 2
    // queryWord 1
    console.log(param);
  }
});

// update `queryWord`
shared.update(`queryWord`, "queryWord 2");

// call `updateQueryWord`
shared.dispatch(`updateQueryWord`, "queryWord 1");

# api

createShared: create a shared. it accepts a object which defines methods

register: register listeners to listen the data-changed event

update: update data

dispatch: call method which defines by createShared

