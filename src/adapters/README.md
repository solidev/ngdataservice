# Backend adapter

## Description

A backend adapter provides the identification step between a model 
instance and a backend :

```
# Existing item
let train = { id: 12, name: "train" };
expect(adapter.identifier(train))
  .to.equal("/trains/12"};
# Unsaved item
let train2 = {id: null, name: "new train"}
expect(adapter.identifier(train2))
  .to.equal("/trains");
# Search / get list
expect(adapter.identifier({search: {name: "train"}})
  .to.equal("/trains?name=train");
```


## Provided adapters

### Flat REST adapter (for RESTBackend)

RESTBackend consumes identifiers in `{path, headers, query}` form.
Flat REST adapter takes a REST_ADAPTER_CONFIG : `{basePath}`

Object identifier is appended to basePath; search and create paths are
just basePath. Search parameters are set as query part.

```
let adapter = new DSRestUrlAdapter({basePath: "/api/v1/trains"});
let train = {id: 12, name: "train"};
console.log(adapter.identifier(train));
# {path: '/api/v1/trains/12', query: {}, headers: {}}

console.log(adapter.search())
# {path: '/api/v1/trains', query: {}, headers: {}}

console.log(adapter.search({search: {name: "train"}})
# {path: '/api/v1/trains', query: {name: 'train'}, headers: {}}
```
