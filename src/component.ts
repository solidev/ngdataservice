import {Datastore} from "./collection";
import {Observable} from "rxjs/Rx";
import {omitBy} from "lodash";


export interface IDataObject {
  id:number;
}

/**
 * Data object base class.
 * Provides base functions for save, remove, refresh and ?update object based functions.
 */
export class Dataobject implements IDataObject {
  public id:number = -1;

  /**
   * Construct object from (optional) value object and (optional) datastore reference.
   * @param values Initial values
   * @param _ds Datastore reference
   */
  constructor(values:any = null, protected _ds:Datastore<any> = null) {
    this.assign(values);
  }

  /**
   * Assign values to object. Raises error / returns false is some problem happened.
   * @param values object containing values.
   * @returns {boolean} true if assignation was successful
   */
  public assign(values:any = null): boolean {
    if (values) {
      Object.assign(this, values);
    }
    return true;
  }

  /**
   * Save object using datastore save method.
   * @see return value ?
   * @returns {Observable<boolean>}
   */
  public save():Observable<boolean> {
    this._checkDs();
    return this._ds.save(this);
  }

  /**
   * Remove object using datastore remove method.
   * @see return value ?
   * @returns {Observable<boolean>}
   */
  public remove():Observable<boolean> {
    this._checkDs();
    return this._ds.remove(this);
  }

  /**
   * Refresh object from datastore.
   * @see return value ?
   * @returns {Observable<boolean>}
   */
  public refresh():Observable<boolean> {
    this._checkDs();
    return this._ds.refresh(this);
  }

  /**
   * Export object to json, removing private and circular references.
   * @see return cleaned object
   * @returns {Object} cleaned object
   */
  public toJSON():any {
    return omitBy(this, (value, key) => {
      return (key[0] === "_") || (key[0] === "$");
    });
  }

  /**
   * Checks if object is associated to a datastore.
   * @param raise if true (default), raises an Error if no datastore is given
   * @returns {boolean}
   * @private
   */
  private _checkDs(raise:boolean = true):boolean {
    if (!this._ds) {
      if (raise) {
        throw new Error("Datastore not defined");
      }
      return false;
    }
    return true;
  }

}
