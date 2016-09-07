import {Observable} from "rxjs/Rx";
import {IDSModel, IDSValidationResult, IDSValidationOptions} from "./interface";
import {IDSCollection} from "../collection/interface";
import {IDSRegister} from "../register/interface";
import {omitBy} from "lodash";

const DEFAULT_VALIDATION_OPTIONS: IDSValidationOptions = {validate: true, async: true};
/**
 * Data object base class.
 * Provides base functions for save, remove, refresh and ?update object based functions.
 */
export class DSModel implements IDSModel {
    protected _collection: IDSCollection<DSModel>;
    protected _datasources: IDSRegister;
    private _localId: string;


    /**
     * Construct object from (optional) value object.
     * @param values Initial values (not validated)
     * @param collection Object's collection
     */
    constructor(collection: IDSCollection<DSModel> = null, values: any = null) {
        this.assign(values, {validate: false}); // SEE: check if validation should be on ?
        this._collection = collection;
    }

    /**
     * Returns object primary key (from getPk()).
     * @returns {number|string}
     * @private
     */
    public get _pk(): number|string {
        return this.getPk();
    }

    /**
     * Returns (and generate if needed) object local key (random string).
     * @returns {string} random string
     * @private
     */
    public get _local(): any {
        if (!this._localId) {
            this._localId = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
        }
        return this._localId;
    }

    /**
     * Assign values to object. Raises error / returns false is some problem happened.
     * @param values object containing values.
     * @param options validation options
     * @returns {IDSValidationResult} validation results
     */
    public assign(values: any = null,
                  options: IDSValidationOptions = DEFAULT_VALIDATION_OPTIONS): IDSValidationResult {
        if (values) {
            // TODO: implement validation
            Object.assign(this, values);
        }
        return true;
    }

    /**
     * Validate (sync/async) current object.
     * @returns {IDSValidationResult} validation results
     */
    public validate(options: IDSValidationOptions = DEFAULT_VALIDATION_OPTIONS): IDSValidationResult {
        return Observable.of(true);
    }

    /**
     * Checks changed fields (from last retrieve/update/save/refresh).
     * @param fields : array of fields to check; all fields if not given.
     * @returns {Array} array of changed fields.
     */
    public dirty(fields: string[] = []): string[] {
        // TODO: implement fields dirty checking
        return [];
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
     * Helper toJSON that removes internal (and potentially circular) properties.
     * @returns {DSModel} model with _ and $ properties removed.
     */
    public toJSON(): any {
        return omitBy(this, (value, key) => {
            return (key[0] === "_") || (key[0] === "$");
        });
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

    /**
     * Get primary key from object.
     * @returns {any}
     */
    protected getPk(): number|string {
        return this["id"];
    }


}
