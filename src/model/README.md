# Data object : DSModel

Provides fundation class for models. It provides common methods : 

- `assign` to assign values to model fields
- `save` to save or create model to datasource
- `update` to update some fields to datasource
- `remove` to delete model from datasource
- `refresh` to get fresh field values from datasource
- `validate` to check model field values

Models should be used through collections (to use save/update..) methods
but can also be used without collection for validation/assignment.

## Example

### No field infos, no validation

```
class Train extends DSModel {
    public id: number = null;
    public name: string = "";
    
    public formatName(): void {
        this.name = "!"+name;
    }
}
```

## API / specs

Models have to extend `DSModel` base class to get :

### Fields assignment and validation
- **`.assign(data, options): DSValidationResult`** : assign data
  to model fields, returning a validation result
  (see [validate](#validate)) 
  Options are :

    - `validate: true|false` : data is validated before assignation
      (with sync validators, and async validators if `async` is true)
    - `async: true|false` : returns an observable instead of model
       instance; if `validate` is true, then async validators are also
       used.
    
- <a name="validate"></a> **`.validate(options): DSValidationResult`** :
  validate current model instance data. Returns a validation result or
  an observable of validation result (for async validation) :
  `true | [DSValidationError]`. Options : 
    
    - `async: *true*|false` : uses async validators
    - `validate: *true*|false` : do validation
  

- **`.dirty()`: string[]** : return a list of fields updated since last
  save / retrieve / update operation.


### Datastore operations

- **`.save(): Observable(model)`** : save all model fields, returning
  an observable of saved model (= PUT for REST backends)

- **`.update(fields: string[]): Observable(model)`** : save only some 
  model fields (those with name given in fields argument. Returns an
  observable of updated model.

- **`.remove(): Observable(any)`** : remove model. Returns an observable
  of backend response.

- **`.refresh(): Observable(model)`** : retrieve fresh model data from
  backend. Returns an observable of refreshed model.

### Protected methods / entrypoints

- **`getPk()`** : returns primary key value (used for `pk` field, by
  default returns `id` field value). Customize it for special needs.

### Public properties 

- **_pk** : read-only access to primary key (via `.getPk()`)
- **_local** : read-only access to local id

### Protected properties

- **\_collection** : collection of model
  (see [Collection](../collection/README.md))
- **\_datasources** : datasources registry


  







  



