# Backend adapter

## Description

A backend adapter provides the identification step between a model 
instance, a context and a backend :

```typescript
// Example with RestUrlAdapter 
import {DSRestUrlAdapter} from "ngdatastore";
import {expect} from "chai";
let adapter = new DSRestUrlAdapter();

// Existing item, basic mode (adding identifier to basePath)
adapter.config = {basePath: "/train"};
let train = { id: 12, name: "train" };
expect(adapter.identifier(train))
  .to.equal("/trains/12");

// Existing item, template mode (using itemPath, listPath, createPath)
adapter.config = {itemPath: "/trains/${instance.id}/details"};
let train = { id: 12, name: "train" };
expect(adapter.identifier(train))
  .to.equal("/trains/12/details");
  
// Existing item, using context
adapter.config = {basePath: "/countries/${country.code}/trains"};
train = { id: 12, name: "train" };
expect(adapter.identifier(train, {context: {country: {code: "fr"}}}))
  .to.equal("/countries/fr/trains/1");

// Unsaved item, create mode
adapter.config({basePath: "/trains"});
train = {id: null, name: "new train"}
expect(adapter.identifier(train, {create: true}))
  .to.equal("/trains");

// Unsaved item, create mode using template and context
adapter.config({createPath: "/countries/${country}/trains/prepare"});
train = {id: null, name: "new train"}
expect(adapter.identifier(train, {
    context: {country: "fr"},
    create: true}))
  .to.equal("/countries/fr/trains/prepare");

// Search / get list, basic mode
adapter.config({basePath: "/trains"});
expect(adapter.search({filter: {name: "train"}}))
  .to.equal("/trains?name=train");

```

## API / specs

An adapter translates a model instance to it's backend identifier, 
within an optional context. For example, a train with `id=1` corresponds
to a REST url `/api/v1/trains/1`. Within `{train: {id: 1}}` context, a
wagon with `id=12` corresponds to a REST url 
`/api/v1/trains/1/wagons/12`...

- **`constructor(config)`** : an adapter instance can take a config
    object to get translation parameters (example: 
    `IDSRestUrlAdapterConfig: {basePath: string}`

- **`.identifier(instance: DSModel = null | string | number, params = {}): Identifier`** :
    returns an instance identifier, result depends on given parameters :
    
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
    import {DSRestUrlAdapter} from "ngdatastore";
    let ad = new DSRestUrlAdapter({basePath: "/trains"});
    ad.identifier();               // null
    ad.identifier({_pk: 12});      // {path: "/trains/12", ...}
    ad.identifier(12);             // {path: "/trains/12", ...}
    ad.identifier("12");           // {path: "/trains/12", ...}
    ad.identifier({name: "tchou"},
                  {create: true}); // {path: "/trains", ...}
    ad.identifier({_local: 123});  // null
    ad.identifier({_local: 123},
                  {local: true});  // {path: "?__local__/trains/123", ...}
    ```
    
    `params.context` is used to provide all necesary context for
    identifier generation. 

- **`.search(params): any`** : returns a search identifier
    from *filter*, sort, pagination and context params



## Provided adapters

### REST url adapter (for RESTBackend)

RESTBackend consumes identifiers in `{path, headers, query}` form.
Flat REST adapter takes a REST_ADAPTER_CONFIG : `{basePath}` or
`{itemPath, listPath, createPath}`.

Each path is processed via a template engine (lodash template) using
context data and instance data. For example, with a *base
`/api/${instance.id}/${mode}` 

Using **basePath** : object identifier is appended to basePath;
search and create paths are just basePath. Search parameters are set as
query part.

Using **itemPath**, **listPath** or **createPath** allows a customization
of path using templating. Identifier is not added at path end.

**`trailing_slash=true`** option ensures that created path ends with a
trailing slash

```typescript
import DSRestUrlAdapter = DSRestUrlAdapter;
let adapter = new DSRestUrlAdapter({basePath: "/api/v1/trains"});
let train = {_pk 12, name: "train"};
console.log(adapter.identifier(train));
// {path: '/api/v1/trains/12', query: {}, headers: {}}

console.log(adapter.search())
// {path: '/api/v1/trains', query: {}, headers: {}}

console.log(adapter.search({name: "train"})
// {path: '/api/v1/trains', query: {name: 'train'}, headers: {}}
```
