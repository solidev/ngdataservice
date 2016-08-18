import {IDataCollection, IDataCollectionCreateParams, IDataCollectionGetParams, IDataObjectList} from "./interface";
import {IDataObject, IDataObjectConstructor} from "../dataobject/interface";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {IDataBackend} from "../backends/interface";
import {IDataPersistence} from "../persistence/interface";
import {IDataRegister} from "../register/interface";
import {IDataAdapter} from "../backends/rest/adapters/interface";

export class DataCollection<T extends IDataObject> implements IDataCollection {
    protected _adapter: IDataAdapter;
    protected _backend: IDataBackend;
    protected _persistence: IDataPersistence;
    protected _register: IDataRegister;
    protected _base: IDataObjectConstructor<T>;

    protected _items: ReplaySubject<IDataObjectList<T>> = new ReplaySubject<IDataObjectList<T>>(1);
    public items$: Observable<IDataObjectList<T>>;

    constructor() {
        this.items$ = this._items.asObservable();
    }

    public save(instance: T): Observable<T> {
        let identifier: any = this._adapter.identifier(instance);
        if (identifier === null) {
            // Pk is not defined, let's create this item
            identifier = this._adapter.identifier(instance, {create: true});
            let tosave: any = this._adapter.serialize(instance);
            return this._backend.create(identifier, tosave, {})
                .do((fromdb) => {
                    this._adapter.deserialize(fromdb, instance);
                    identifier = this._adapter.identifier(instance);
                    this._persistence.save(identifier, instance);
                });
        }
        // Identifier is defined, it's a full update
        return this.update(instance, []);
    }

    public update(instance: T, fields: string[]): Observable<T> {
        let identifier: any = this._adapter.identifier(instance);
        if (identifier) {
            let tosave: any = this._adapter.serialize(instance);
            return this._backend.update(identifier, tosave, {})
                .do((fromdb) => {
                    this._adapter.deserialize(fromdb, instance);
                    this._persistence.save(identifier, instance);
                });
        }
        throw new Error("Cannot update unsaved item");
    }

    public remove(instance: T): Observable<T> {
        let identifier: any = this._adapter.identifier(instance);
        if (identifier) {
            return this._backend.destroy(identifier, {})
                .do(() => {
                    this._persistence.destroy(identifier);
                });
        }
        throw new Error("Cannot delete unsaved item");
    }

    public refresh(instance: T): Observable<T> {
        let identifier: any = this._adapter.identifier(instance);
        if (identifier) {
            return this._backend.retrieve(identifier, {})
                .do((fromdb) => {
                    this._adapter.deserialize(fromdb, instance);
                    this._persistence.save(identifier, instance);
                });
        }
        throw new Error("Cannot refresh unsaved item");
    }

    public create(values: any, params: IDataCollectionCreateParams = {}): Observable<T> {
        let instance: T = new this._base(this, values);
        if (params.save) {
            return this.save(instance);
        } else if (!params.volatile) {
            this._persistence.save(
                this._adapter.identifier(instance, {unsaved: true}),
                instance
            );
            return Observable.of(instance);
        } else {
            return Observable.of(instance);

        }
    }

    public get(pk: any, params: IDataCollectionGetParams = {}): Observable<T> {
        let identifier = this._adapter.identifier(pk);
        if (params.fromcache) {
            return Observable.of(this._persistence.retrieve(identifier));
        } else {
            return <Observable<T>> this._backend.retrieve(identifier, {})
                .flatMap((instdata) => {
                    let instance = this._persistence.retrieve(identifier);
                    if (!instance) {
                        return this.create(this._adapter.deserialize(instdata), {});
                    } else {
                        this._adapter.deserialize(instdata, instance);
                        this._persistence.save(identifier, instance);
                        return Observable.of(instance);
                    }
                });
        }
    }

    public getList(filter: any, params: IDataCollectionGetParams = {}): Observable<IDataObjectList<T>> {
        let search = this._adapter.search(filter);
        if (params.fromcache) {
            this._persistence.list(search);
        } else {
            this._backend.list(search, {})
                .map((result) => {
                    this._adapter.deserializeMany(result, []);
                });
        }
        return this.items$;
    }
}
