# Collection classes and service

Collection classes provides foundation classes to create data collections.
Collections instances can be injected or created by Collection service.

Collection must have :

- a model reference (`model`)
- a backend service (`backend`)
- one or many persistence services (`persistence`)
- a serializer service (`serializer`)
- an adapter service (`adapter`)
- a paginator service (`paginator`)
- an authentication service (`authentication`)

Those components define collection behaviour; a collection component (
adapter, backend, ...) can be given (in order, first defined component
is chosen) :

1. via an instance (`adapter`, `backend`, ...)
2. via a provider (`adapter_provider`, `backend_provider`, ...)
3. via an instance of setup object (`setup.adapter`, `setup.backend`, ...)
4. via a provider through setup object (`setup.adapter_provider`,
  `setup.backend_provider`, ...)

Each component configuration (if needed) can be given through

1. via a collection property (`adapter_config`, `backend_config`, ...)
2. via a setup property (`setup.adapter_config`, `backend_config`, ...)
## Example

TODO

## API

- **`constructor(setup, context)`** : a collection is build using an
  optional setup object, and an optional context object (available on
  all components calls).

- **`init()`** called just after collection instanciation (by default :
  do nothing)

### Instance methods

- **`create(values, params): Observable(model)`** : create a new
  instance of model, returning an observable of created instance.
  Initial data for model fields is given in `values`, and can be
  validated using `params.validation = true` parameter. If validation
  fails, the observable is errored, and the error contains the
  `ValidationResult` object. The created instance can be saved to
  backend (`params.save = true`), just stored in persistence layer
  (the default), or not stored at all (`params.volatile = true`).
  Parameters are (defaults in italic):
    - `validation` : true (full validation) | *false (no validation)* | 
      "sync" (sync validation only)
    - `save` : true (object is saved) | *false (no save)*
    - `volatile` : true (don't store object in persistence) 
      | *false (store object in persistence)*
  
- **`save(model): Observable(model)`** : save a model instance. If
  provided instance is not already saved (no primary key), it is
  created (using backend's `create`). If instance is already saved,
  it's an update (using backend's full `update`). Saved object
  is also saved in persistence layer. Returns an observable of
  saved model instance.
  
- **`update(model, fields): Observable(model)`** : partial update of
  model fields (using backend's partial `update`. Returns an observable
  of updated model instance.
  
- **`remove(model): Observable(any)`** : delete instance from persistance
  and backend (using backend's `destroy`). Returns an observable of
  server response.
  
- **`refresh(model)`** : update instance from a fresh copy of model (using
  backend's `retrieve`). Returns an observable of refreshed instance.
  
- **`get(pk, params): Observable(model)`** : retrieve an object from
  backend or persistence (`params.fromcache = true`, no backend access,
  or `params.dual = true`, observable fires instance from cache then
  instance from backend). Object is saved to persistence layer.
  Returns an observable of object instance.
  
### Collection / filter / pagination methods

TODO
 


