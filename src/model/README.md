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



