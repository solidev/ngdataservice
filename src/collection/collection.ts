import {IDSModel, IDSModelConstructor} from "../model/interface";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {IDSBackend, IDSBackendProvider} from "../backends/interface";
import {IDSPersistence, IDSPersistenceProvider} from "../persistence/interface";
import {IDSAdapter, IDSAdapterProvider} from "../adapters/interface";
import {IDSSerializer, IDSSerializerProvider} from "../serializers/interface";
import {IDSCollection, IDSModelList, IDSCollectionCreateParams, IDSCollectionGetParams} from "./interface";
import {IDSAuthentication, IDSAuthenticationProvider} from "../authentication/interface";
import {IDSPaginator, IDSPaginatorProvider} from "../paginators/interface";


export class DSCollection<T extends IDSModel> implements IDSCollection<T> {
    protected _adapter: IDSAdapter;
    protected adapter_provider: IDSAdapterProvider;
    protected adapter_config: any;
    protected _backend: IDSBackend;
    protected backend_provider: IDSBackendProvider;
    protected backend_config: any;
    protected _serializer: IDSSerializer;
    protected serializer_provider: IDSSerializerProvider;
    protected serializer_config: any;
    protected _persistence: IDSPersistence;
    protected persistence_provider: IDSPersistenceProvider;
    protected persistence_config: any;
    protected _authentication: IDSAuthentication;
    protected authentication_provider: IDSAuthenticationProvider;
    protected authentication_config: any;
    protected _paginator: IDSPaginator;
    protected paginator_service: IDSPaginatorProvider;
    protected paginator_config: any;
    protected _base: IDSModelConstructor<T>;
    protected _context: any;

    protected _items: ReplaySubject<IDSModelList<T>> = new ReplaySubject<IDSModelList<T>>(1);
    public items$: Observable<IDSModelList<T>>;

    constructor(context: any) {
        this.items$ = this._items.asObservable();
        this._context = context;
    }

    public save(instance: T): Observable<T> {
        let identifier: any = this.get_adapter().identifier(instance, {});
        if (identifier === null) {
            // Pk is not defined, let's create this item
            identifier = this.get_adapter().identifier(instance, {create: true});
            let tosave: any = this.get_serializer().serialize(instance);
            return this.get_backend().create(identifier, tosave, {})
                .do((fromdb) => {
                    instance.assign(this.get_serializer().deserialize(fromdb));
                    identifier = this.get_adapter().identifier(instance, {});
                    this.get_persistence().save(identifier, instance);
                });
        }
        // Identifier is defined, it's a full update
        return this.update(instance, []);
    }

    public update(instance: T, fields: string[]): Observable<T> {
        let identifier: any = this.get_adapter().identifier(instance, {});
        if (identifier) {
            let tosave: any = this.get_serializer().serialize(instance);
            return this.get_backend().update(identifier, tosave, {})
                .do((fromdb) => {
                    instance.assign(this.get_serializer().deserialize(fromdb));
                    this.get_persistence().save(identifier, instance);
                });
        }
        throw new Error("Cannot update unsaved item");
    }

    public remove(instance: T): Observable<T> {
        let identifier: any = this.get_adapter().identifier(instance, {});
        if (identifier) {
            return this.get_backend().destroy(identifier, {})
                .do(() => {
                    this.get_persistence().destroy(identifier);
                });
        }
        throw new Error("Cannot delete unsaved item");
    }

    public refresh(instance: T): Observable<T> {
        let identifier: any = this.get_adapter().identifier(instance, {});
        if (identifier) {
            return this.get_backend().retrieve(identifier, {})
                .do((fromdb) => {
                    instance.assign(this.get_serializer().deserialize(fromdb));
                    this.get_persistence().save(identifier, instance);
                });
        }
        throw new Error("Cannot refresh unsaved item");
    }

    public create(values: any, params: IDSCollectionCreateParams = {}): Observable<T> {
        let instance: T = new this._base(this, values);
        if (params.save) {
            return this.save(instance);
        } else if (!params.volatile) {
            this.get_persistence().save(
                this.get_adapter().identifier(instance, {unsaved: true}),
                instance
            );
            return Observable.of(instance);
        } else {
            return Observable.of(instance);

        }
    }

    public get(pk: any, params: IDSCollectionGetParams = {}): Observable<T> {
        let identifier = this.get_adapter().identifier(pk);
        if (params.fromcache) {
            return Observable.of(this.get_persistence().retrieve(identifier));
        } else {
            return <Observable<T>> this.get_backend().retrieve(identifier, {})
                .flatMap((instdata) => {
                    let instance = this.get_persistence().retrieve(identifier);
                    if (!instance) {
                        return this.create(this.get_serializer().deserialize(instdata), {});
                    } else {
                        instance.assign(this.get_serializer().deserialize(instdata));
                        this.get_persistence().save(identifier, instance);
                        return Observable.of(instance);
                    }
                });
        }
    }

    public filter(filter: any, params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        let search = this.get_adapter().search(filter);
        if (params.fromcache) {
            this.get_persistence().list(search);
        } else {
            this.get_backend().list(search, {})
                .map((result) => {
                    return this.get_serializer().deserializeMany(result);
                });
        }
        return this.items$;
    }

    public all(params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        return this.filter({}, params);
    }

    protected get_adapter(): IDSAdapter {
        return <IDSAdapter>this.get_service("adapter", this.get_adapter_config());
    }

    protected get_adapter_config(): any {
        return this.get_service_config("adapter");
    }

    protected get_backend(): IDSBackend {
        return <IDSBackend>this.get_service("backend", this.get_backend_config());
    }

    protected get_backend_config(): any {
        return this.get_service_config("backend");
    }

    protected get_serializer(): IDSSerializer {
        return <IDSSerializer>this.get_service("serializer", this.get_serializer_config());
    }

    protected get_serializer_config(): any {
        return this.get_service_config("serializer");
    }

    protected get_persistence(): IDSPersistence {
        return <IDSPersistence>this.get_service("persistence", this.get_persistence_config());
    }

    protected get_persistence_config(): any {
        return this.get_service_config("persistence");
    }

    protected get_authentication(): IDSAuthentication {
        return <IDSAuthentication>this.get_service("authentication", this.get_authentication_config());
    }

    protected get_authentication_config(): any {
        return this.get_service_config("authentication");
    }
    protected get_paginator(): IDSPaginator {
        return <IDSPaginator>this.get_service("paginator", this.get_paginator_config());
    }

    protected get_paginator_config(): any {
        return this.get_service_config("paginator");
    }

    private get_service(name: string, config: any): any {
        if (!this["_" + name]) {
            if (this[name + "_provider"]) {
                this["_" + name] = this[name + "_provider"].provide(config);
            } else {
                throw new Error("No " + name + " provided");
            }
        }
        return this["_" + name];
    }

    private get_service_config(name: string): any {
        return this[name + "_config"];
    }


}
