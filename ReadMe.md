## shared
share the data between different modules

work with react or vue

use to instead of redux

## demo
```
// register `updateQueryWord` method and it's triggered by `shared.dispatch`
let shared = createShared({
  `updateQueryWord`: (param: any, update: Function, dispatch: Function) => {
    // param = `queryWord 1`
    update("queryWord", param);
  }
}, [`queryWord`])

// register listener and it's called when `queryWord` changed
shared.register({
  `queryWord`: (param: any) => {
    // queryWord 2
    // queryWord 1
    console.log(param);
  }
});

// change `queryWord` to `queryWord 2`
shared.update(`queryWord`, `queryWord 2`);

// call `updateQueryWord`
shared.dispatch(`updateQueryWord`, `queryWord 1`);
```

## api

createShared: create a shared. it accepts a object which defines methods

register: register listeners to listen the data-changed event

update: update data

dispatch: call method which defines by createShared

