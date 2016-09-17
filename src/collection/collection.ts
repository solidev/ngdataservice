import {IDSModel, IDSModelConstructor} from "../model/interface";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {IDSBackend, IDSBackendProvider, IDSBackendClass} from "../backends/interface";
import {IDSPersistence, IDSPersistenceProvider, IDSPersistenceClass} from "../persistence/interface";
import {IDSAdapter, IDSAdapterProvider, IDSAdapterClass} from "../adapters/interface";
import {IDSSerializer, IDSSerializerProvider, IDSSerializerClass} from "../serializers/interface";
import {
    IDSCollection,
    IDSModelList,
    IDSCollectionCreateParams,
    IDSCollectionGetParams,
    IDSCollectionSetup
} from "./interface";
import {IDSAuthentication, IDSAuthenticationProvider, IDSAuthenticationClass} from "../authentication/interface";
import {IDSPaginator, IDSPaginatorProvider, IDSPaginatorClass} from "../paginators/interface";
import {IDSFilterProvider, IDSFilter, IDSFilterClass} from "../filters/interface";
import {IDSSorter, IDSSorterProvider, IDSSorterClass} from "../sorters/interface";
import {DSRegister} from "../register/register";
import {IDSRegister} from "../register/interface";


export class DSCollection<T extends IDSModel> implements IDSCollection<T> {

    public model: IDSModelConstructor<T>;
    public items$: Observable<IDSModelList<T>>;
    public datasources: IDSRegister;

    protected adapter: IDSAdapter;
    protected adapter_class: IDSAdapterClass;
    protected adapter_provider: IDSAdapterProvider;
    protected adapter_config: any;
    protected backend: IDSBackend;
    protected backend_class: IDSBackendClass;
    protected backend_provider: IDSBackendProvider;
    protected backend_config: any;
    protected serializer: IDSSerializer;
    protected serialize_class: IDSSerializerClass;
    protected serializer_provider: IDSSerializerProvider;
    protected serializer_config: any;
    protected persistence: IDSPersistence;
    protected persistence_class: IDSPersistenceClass;
    protected persistence_provider: IDSPersistenceProvider;
    protected persistence_config: any;
    protected authentication: IDSAuthentication;
    protected authentication_class: IDSAuthenticationClass;
    protected authentication_provider: IDSAuthenticationProvider;
    protected authentication_config: any;
    public paginator: IDSPaginator;
    public paginator_class: IDSPaginatorClass;
    protected paginator_provider: IDSPaginatorProvider;
    protected paginator_config: any;
    public filter: IDSFilter;
    protected filter_class: IDSFilterClass;
    protected filter_provider: IDSFilterProvider;
    protected filter_config: any;
    public sorter: IDSSorter;
    protected sorter_class: IDSSorterClass;
    protected sorter_provider: IDSSorterProvider;
    protected sorter_config: any;
    protected _context: any;
    protected setup: IDSCollectionSetup;
    protected _items: ReplaySubject<IDSModelList<T>> = new ReplaySubject<IDSModelList<T>>(1);

    constructor(setup: IDSCollectionSetup = null, context: any = {}) {
        if (setup) {
            this.setup = setup;
        }
        if (!this.datasources) {
            this.datasources = this.setup.datasources;
        }
        this._context = context;
        this.items$ = this._items.asObservable();
        this.init();
    }


    public init(): void {
        return null;
    }

    public create(values: any = {}, params: IDSCollectionCreateParams = {}): Observable<T> {
        let instance: T = new this.model(this, values);
        if (params.save) {
            return this.save(instance);
        } else if (!params.volatile) {
            this.get_persistence().save(
                this.get_adapter().identifier(instance, {create: true}),
                instance
            );
            return Observable.of(instance);
        } else {
            return Observable.of(instance);

        }
    }

    public save(instance: T): Observable<T> {
        let identifier: any = this.get_adapter().identifier(instance);
        if (identifier == null) {
            // Pk is not defined, let's save this item
            identifier = this.get_adapter().identifier(instance, {create: true});
            let tosave: any = this.get_serializer().serialize(instance);
            return <Observable<T>>this.get_backend().create(identifier, tosave, {})
                .map((fromdb) => {
                    instance.assign(this.get_serializer().deserialize(fromdb));
                    identifier = this.get_adapter().identifier(instance);
                    this.get_persistence().save(identifier, instance);
                    return <T>instance;
                });
        } else {
            // Identifier is defined, it's a full update
            return this.update(instance, []);
        }
    }

    public update(instance: T, fields: string[]): Observable<T> {
        let identifier: any = this.get_adapter().identifier(instance);
        if (identifier) {
            let tosave: any = this.get_serializer().serialize(instance);
            return <Observable<T>>this.get_backend().update(identifier, tosave, {})
                .map((fromdb) => {
                    instance.assign(this.get_serializer().deserialize(fromdb));
                    this.get_persistence().save(identifier, instance);
                    return instance;
                });
        }
        throw new Error("Cannot update unsaved item");
    }

    public remove(instance: T | number | string): Observable<any> {
        let identifier: any = this.get_adapter().identifier(instance);
        if (identifier) {
            return this.get_backend().destroy(identifier, {})
                .do(() => {
                    this.get_persistence().destroy(identifier);
                });
        }
        throw new Error("Cannot delete unsaved item");
    }

    public refresh(instance: T): Observable<T> {
        let identifier: any = this.get_adapter().identifier(instance);
        if (identifier) {
            return this.get_backend().retrieve(identifier, {})
                .do((fromdb) => {
                    instance.assign(this.get_serializer().deserialize(fromdb));
                    this.get_persistence().save(identifier, instance);
                });
        }
        throw new Error("Cannot refresh unsaved item");
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

    public action(instance: T, action: string, args: any): Observable<any> {
        let identifier = this.get_adapter().identifier(instance);
        return this.get_backend().action(identifier, action, args);
    }

    public list(filter: any, params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        this.get_filter().update(filter);
        if (params.fromcache) {
            return Observable.of(
                this.get_persistence().list(
                    this.get_filter().localFilter,
                    this.get_sorter().localSorter
                )
            );
        } else {
            let search = this.get_adapter().search(this.get_filter().backendFilter);
            console.log("Search", search);
            this.get_backend().list(search, {})
                .subscribe((result) => {
                    let pagination = this.get_paginator().getPaginationInfos(result);
                    let items = this.get_paginator().getResults(result);
                    let _items = [];
                    for (let item of items) {
                        let itemdata = this.get_serializer().deserialize(item);
                        console.log("Data", itemdata);
                        let temp = new this.model(this, itemdata);
                        console.log("Temp", temp);
                        let identifier = this.get_adapter().identifier(temp);
                        let instance = this.get_persistence().retrieve(identifier);
                        if (instance) {
                            instance.assign(itemdata);
                            this.get_persistence().save(identifier, instance);
                            console.log("Instance", instance);
                            _items.push(instance);
                        } else {
                            console.log("Temp", temp);
                            this.get_persistence().save(identifier, temp);
                            _items.push(temp);
                        }
                        console.log("Item", item);
                    }
                    // TODO: save persistence of results ids ?
                    let output = {items: _items, pagination: pagination};
                    this._items.next(output);
                });
            return this.items$;
        }

    }

    public all(params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        return this.list({}, params);
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

    protected get_filter(): IDSFilter {
        return <IDSFilter>this.get_service("filter", this.get_filter_config());
    }

    protected get_filter_config(): any {
        return this.get_service_config("filter");
    }

    protected get_sorter(): IDSSorter {
        return <IDSSorter>this.get_service("sorter", this.get_sorter_config());
    }

    protected get_sorter_config(): any {
        return this.get_service_config("sorter");
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
        if (!this[name]) {
            if (this[name + "_class"]) {
                this[name] = new this[name + "_class"](config);
            } else if (this[name + "_provider"]) {
                this[name] = this[name + "_provider"].provide(config);
            } else if (this.setup[name]) {
                this[name] = this.setup[name];
            } else if (this.setup[name + "_class"]) {
                this[name] = new this.setup[name + "_class"](config);
            } else if (this.setup[name + "_provider"]) {
                let provider: any = this.setup[name + "_provider"];
                this[name] = provider.provide(config);
            } else {
                throw new Error(name + " service is not defined");
            }
        }
        return this[name];
    }

    private get_service_config(name: string): any {
        if (this[name + "_config"]) {
            return this[name + "_config"];
        } else if (this.setup[name + "_config"]) {
            return this.setup[name + "_config"];
        } else {
            // SEE: default values ? false ? undefined ?
            return null;
        }
    }


}
