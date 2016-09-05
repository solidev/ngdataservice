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

## API / specs

An adapter translates a model instance to it's backend identifier. For
example, a train with `id=1` corresponds to a REST url `/api/v1/trains/1`

- **`constructor(config)`** : an adapter instance can take a config
    object to get translation parameters (example: 
    `IDSFlatRestAdapterConfig: {basePath: string}`

- **`.identifier(instance: DSModel = null | string | number, params = {}): Identifier`** :
    returns instance identifier, result depends on given parameters :
    
    - `params.local = true|*false*` : returns local instance identifier
    - `params.save = true|*false*` : returns an identifier for creation
    
    if `params.local` and `params.save` are both false (the defaults),
    
    - if *instance* is null or not given, or if instance has no primary key,
       returns null
    - if *instance* has a valid pk, returns instance identifier.
    - if *instance* is a string or number, returns identifier
        of object with this pk
    
    Examples : 
    ```typescript
    import {DSFlatRestUrlAdapter} from "ng2datastore";
    let ad = new DSFlatRestUrlAdapter({basePath: "/trains"});
    ad.identifier();               // null
    ad.identifier({_pk: 12}));     // {path: "/trains/12", ...}
    ad.identifier(12);             // {path: "/trains/12", ...}
    ad.identifier("12");           // {path: "/trains/12", ...}
    ad.identifier({name: "tchou"},
                  {create: true}); // {path: "/trains", ...}
    ad.identifier({_local: 123});  // null
    ad.identifier({_local: 123},
                  {local: true});  // {path: "?__local__/trains/123", ...}
    ```

- **`.search(filter, sorter): any`** : returns a search identifier
    from filter and sort params



## Provided adapters

### Flat REST adapter (for RESTBackend)

RESTBackend consumes identifiers in `{path, headers, query}` form.
Flat REST adapter takes a REST_ADAPTER_CONFIG : `{basePath}`

Object identifier is appended to basePath; search and create paths are
just basePath. Search parameters are set as query part.

```
let adapter = new DSRestUrlAdapter({basePath: "/api/v1/trains"});
let train = {_pk 12, name: "train"};
console.log(adapter.identifier(train));
# {path: '/api/v1/trains/12', query: {}, headers: {}}

console.log(adapter.search())
# {path: '/api/v1/trains', query: {}, headers: {}}

console.log(adapter.search({name: "train"})
# {path: '/api/v1/trains', query: {name: 'train'}, headers: {}}
```
