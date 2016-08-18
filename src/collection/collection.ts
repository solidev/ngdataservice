import {IDSModel, IDSModelConstructor} from "../model/interface";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {IDSBackend} from "../backends/interface";
import {IDSPersistence} from "../persistence/interface";
import {IDSAdapter} from "../adapters/interface";
import {IDSSerializer} from "../serializers/interface";
import {IDSCollection, IDSModelList, IDSCollectionCreateParams, IDSCollectionGetParams} from "./interface";

export class DSCollection<T extends IDSModel> implements IDSCollection {
    protected _adapter: IDSAdapter;
    protected _backend: IDSBackend;
    protected _serializer: IDSSerializer;
    protected _persistence: IDSPersistence;
    protected _base: IDSModelConstructor<T>;
    protected _context: any;

    protected _items: ReplaySubject<IDSModelList<T>> = new ReplaySubject<IDSModelList<T>>(1);
    public items$: Observable<IDSModelList<T>>;

    constructor(context: any) {
        this.items$ = this._items.asObservable();
        this._context = context;
    }

    public save(instance: T): Observable<T> {
        let identifier: any = this._adapter.identifier(instance);
        if (identifier === null) {
            // Pk is not defined, let's create this item
            identifier = this._adapter.identifier(instance, {create: true});
            let tosave: any = this._serializer.serialize(instance);
            return this._backend.create(identifier, tosave, {})
                .do((fromdb) => {
                    instance.assign(this._serializer.deserialize(fromdb));
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
            let tosave: any = this._serializer.serialize(instance);
            return this._backend.update(identifier, tosave, {})
                .do((fromdb) => {
                    instance.assign(this._serializer.deserialize(fromdb));
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
                    instance.assign(this._serializer.deserialize(fromdb));
                    this._persistence.save(identifier, instance);
                });
        }
        throw new Error("Cannot refresh unsaved item");
    }

    public create(values: any, params: IDSCollectionCreateParams = {}): Observable<T> {
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

    public get(pk: any, params: IDSCollectionGetParams = {}): Observable<T> {
        let identifier = this._adapter.identifier(pk);
        if (params.fromcache) {
            return Observable.of(this._persistence.retrieve(identifier));
        } else {
            return <Observable<T>> this._backend.retrieve(identifier, {})
                .flatMap((instdata) => {
                    let instance = this._persistence.retrieve(identifier);
                    if (!instance) {
                        return this.create(this._serializer.deserialize(instdata), {});
                    } else {
                        instance.assign(this._serializer.deserialize(instdata));
                        this._persistence.save(identifier, instance);
                        return Observable.of(instance);
                    }
                });
        }
    }

    public filter(filter: any, params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        let search = this._adapter.search(filter);
        if (params.fromcache) {
            this._persistence.list(search);
        } else {
            this._backend.list(search, {})
                .map((result) => {
                    return this._serializer.deserializeMany(result);
                });
        }
        return this.items$;
    }

    public all(params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        return this.filter({}, params);
    }
}
