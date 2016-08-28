import {Observable} from "rxjs/Rx";
import {IDSModel} from "./interface";
import {IDSCollection} from "../collection/interface";



/**
 * Data object base class.
 * Provides base functions for save, remove, refresh and ?update object based functions.
 */
export class DSModel implements IDSModel {
    public pk: any = null;
    private _collection: IDSCollection<DSModel>;


    /**
     * Construct object from (optional) value object.
     * @param values Initial values
     * @param collection Object's collection
     */
    constructor(collection: IDSCollection<DSModel> = null, values: any = null) {
        this.assign(values);
        this._collection = collection;
    }

    /**
     * Assign values to object. Raises error / returns false is some problem happened.
     * @param values object containing values.
     * @returns {boolean} true if assignation was successful
     */
    public assign(values: any = null): DSModel {
        if (values) {
            // TODO: use validation
            Object.assign(this, values);
        }
        return this;
    }

    /**
     * Save object using collection save method.
     * @see return value ?
     * @returns {Observable<boolean>}
     */
    public save(): Observable<any> {
        this._checkCollection();
        return this._collection.save(this);
    }


    /**
     * Save object using collection update method.
     * @see return value ?
     * @returns {Observable<boolean>}
     */
    public update(fields: string[]): Observable<any> {
        this._checkCollection();
        return this._collection.update(this, fields);
    }

    /**
     * Remove object using datacollection remove method.
     * @see return value ?
     * @returns {Observable<boolean>}
     */
    public remove(): Observable<any> {
        this._checkCollection();
        return this._collection.remove(this);
    }

    /**
     * Refresh object from datacollection.
     * @see return value ?
     * @returns {Observable<boolean>}
     */
    public refresh(): Observable<any> {
        this._checkCollection();
        return this._collection.refresh(this);
    }


    /**
     * Validate (sync/async) current object.
     * @returns {Observable<errors>} observable(true) if valid, observable(error array) if invalid
     */
    public validate(): Observable<any> {
        return Observable.of(true);
    }

    /**
     * Checks if object is associated to a datacollection.
     * @param raise if true (default), raises an Error if no datacollection is given
     * @returns {boolean}
     * @protected
     */
    protected _checkCollection(raise: boolean = true): boolean {
        if (!this._collection) {
            if (raise) {
                throw new Error("No collection defined");
            }
            return false;
        }
        return true;
    }

}
