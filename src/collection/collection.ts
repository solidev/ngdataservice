import { IDSModel, IDSModelClass } from "../model/interface";
import { Observable } from "rxjs/Observable";
import { IDSBackend, IDSBackendClass, IDSBackendProvider } from "../backends/interface";
import { IDSPersistence, IDSPersistenceClass, IDSPersistenceProvider } from "../persistence/interface";
import { IDSAdapter, IDSAdapterClass, IDSAdapterProvider } from "../adapters/interface";
import { IDSSerializer, IDSSerializerClass, IDSSerializerProvider } from "../serializers/interface";
import {
    IDSCollection, IDSCollectionActionFullParams,
    IDSCollectionActionParams,
    IDSCollectionContext,
    IDSCollectionCreateParams,
    IDSCollectionGetParams,
    IDSCollectionRemoveParams,
    IDSCollectionSetup
} from "./interface";
import { IDSAuthentication, IDSAuthenticationClass, IDSAuthenticationProvider } from "../authentication/interface";
import { IDSRegister } from "../register/interface";
import { DSConfig } from "../configuration";
import { IDSQueryset, IDSQuerysetClass, IDSQuerysetProvider } from "../queryset/interface";
import { DSQueryset } from "../queryset/queryset";
import { defaults, extend, isString } from "lodash";
import { IDSSorterClass, IDSSorterProvider } from "../sorters/interface";
import { IDSFilterClass, IDSFilterProvider } from "../filters/interface";
import { IDSPaginatorClass, IDSPaginatorProvider } from "../paginators/interface";
import "rxjs/add/operator/do";
import "rxjs/add/operator/mergeMap";

export class DSCollection<T extends IDSModel> extends DSConfig<IDSCollectionSetup> implements IDSCollection<T> {

    public model: IDSModelClass<T>;
    public datasources: IDSRegister;
    public setup: any;
    public context: { [index: string]: any };

    public paginator_class: IDSPaginatorClass;
    public paginator_provider: IDSPaginatorProvider;
    public paginator_config: any;

    public filter_class: IDSFilterClass;
    public filter_provider: IDSFilterProvider;
    public filter_config: any;

    public sorter_class: IDSSorterClass;
    public sorter_provider: IDSSorterProvider;
    public sorter_config: any;

    protected adapter_class: IDSAdapterClass;
    protected adapter_provider: IDSAdapterProvider;
    protected adapter_config: any;

    protected serializer_class: IDSSerializerClass;
    protected serializer_provider: IDSSerializerProvider;
    protected serializer_config: any;

    protected persistence_class: IDSPersistenceClass;
    protected persistence_provider: IDSPersistenceProvider;
    protected persistence_config: any;


    protected queryset_class: IDSQuerysetClass<T> = DSQueryset;
    protected queryset_provider: IDSQuerysetProvider<T>;
    protected queryset_config: any;

    protected backend_class: IDSBackendClass;
    protected backend_provider: IDSBackendProvider;
    protected backend_config: any;

    protected _context: any;

    /* tslint:disable:no-unused-variable */
    private _adapter: IDSAdapter;
    private _backend: IDSBackend;
    private _serializer: IDSSerializer;
    private _persistence: IDSPersistence;
    private _authentication: IDSAuthentication;
    /* tslint:enable */


    constructor(setup: IDSCollectionSetup = {}, context: IDSCollectionContext = {}) {
        super();
        this.setup = defaults(this.setup || {}, setup);
        if (!this.datasources) {
            this.datasources = this.setup.datasources;
        }
        this.context = context;
        this.init();
    }


    public init(): void {
        return null;
    }

    public create(values: any = {}, params: IDSCollectionCreateParams = {}): Observable<T> {
        let context: any = extend({}, this.context, params.context || {});
        let instance: T = new this.model(this, values, context);
        if (params.save) {
            return this.save(instance);
        } else if (!params.volatile) {
            this.persistence.save(
                this.adapter.detail(instance, {create: true, context: context}),
                instance
            );
            return Observable.of(instance);
        } else {
            return Observable.of(instance);

        }
    }

    public save(instance: T): Observable<T> {
        let context: any = extend({}, this.context, (<any>instance)._context);
        let identifier: any = this.adapter.detail(instance, {context: context});
        if (identifier == null) {
            // Pk is not defined, let's save this item
            identifier = this.adapter.detail(instance, {create: true, context: context});
            let tosave: any = this.serializer.serialize(instance, context, []);
            return <Observable<T>>this.backend.create(identifier, tosave, {context: context})
                .map((fromdb) => {
                    instance.assign(this.serializer.deserialize(fromdb, {context: context}), context);
                    identifier = this.adapter.detail(instance, {context: context});
                    this.persistence.save(identifier, instance, {context: context});
                    return <T>instance;
                });
        } else {
            // Identifier is defined, it's a full update
            return this.update(instance, []);
        }
    }

    public update(instance: T, fields: string[] = []): Observable<T> {
        let context: any = extend({}, this.context, (<any>instance)._context);
        let identifier: any = this.adapter.detail(instance, {context: context});
        if (identifier) {
            let tosave: any = this.serializer.serialize(instance, context, fields);
            if (fields.length > 0) {
                return <Observable<T>>this.backend.partial_update(identifier, tosave, {context: context})
                    .map((fromdb) => {
                        instance.assign(this.serializer.deserialize(fromdb, {context: context}), context);
                        this.persistence.save(identifier, instance, {context: context});
                        return instance;
                    });
            } else {
                return <Observable<T>>this.backend.update(identifier, tosave, {context: context})
                    .map((fromdb) => {
                        instance.assign(this.serializer.deserialize(fromdb, {context: context}), context);
                        this.persistence.save(identifier, instance, {context: context});
                        return instance;
                    });
            }
        }
        throw new Error("Cannot update unsaved item");
    }

    // SEE: use params for query/headers ?
    public remove(instance: T | number | string, params: IDSCollectionRemoveParams = {}): Observable<any> {
        let context: any = extend({}, this.context, (<any>instance)._context);
        let identifier: any = this.adapter.detail(instance, {context: context, options: {query: params}});
        if (identifier) {
            return this.backend.destroy(identifier, {context: context})
                .do(() => {
                    this.persistence.destroy(identifier, {context: context});
                });
        }
        throw new Error("Cannot delete unsaved item");
    }

    public refresh(instance: T): Observable<T> {
        let context: any = extend({}, this.context, (<any>instance)._context);
        let identifier: any = this.adapter.detail(instance, {context: context});
        if (identifier) {
            return this.backend.retrieve(identifier, {context: context})
                .do((fromdb) => {
                    instance.assign(this.serializer.deserialize(fromdb, {context: context}), context);
                    this.persistence.save(identifier, instance, {context: context});
                });
        }
        throw new Error("Cannot refresh unsaved item");
    }

    public get(pk: any, params: IDSCollectionGetParams = {}): Observable<T> {
        let context: any = extend({}, this.context, params.context || {});
        let identifier = this.adapter.detail(pk, {options: params.options, context: context});
        if (identifier === null) {
            throw new Error("Unknow identifier, from " + pk);
        }
        if (params.fromcache) {
            let out: T = this.persistence.retrieve(identifier, {context: context});
            if (out) {
                return Observable.of(out);
            }
        }
        return <Observable<T>> this.backend.retrieve(identifier, {context: context})
            .flatMap((instdata) => {
                console.log("Received data", instdata);
                let instance = this.persistence.retrieve(identifier, {context: context});
                if (!instance) {
                    console.log("Creating instance", instdata);
                    return this.create(this.serializer.deserialize(instdata, {context: context}),
                        {context: context});
                } else {
                    instance.assign(this.serializer.deserialize(instdata, {context: context}), context);
                    this.persistence.save(identifier, instance, {context: context});
                    return Observable.of(instance);
                }
            });
    }

    public action(instance: T, action: string, args: IDSCollectionActionParams): Observable<any> {
        let cargs: IDSCollectionActionFullParams = isString(args) ? {url: args, body: {}} : args;
        let context: any = extend({}, this.context, cargs.context || {});
        let identifier: any;
        if (instance === null) {
            identifier = this.adapter.list({context: context});
        } else {
            identifier = this.adapter.detail(instance, {context: context});
        }
        let actargs = extend({}, cargs, {context: context});
        return this.backend.action(identifier, action, actargs);
    }


    public get queryset(): IDSQueryset<T> {
        return <IDSQueryset<T>>this.get_service("queryset", this.get_queryset_config(), false);
    }

    public get_queryset_config(): any {
        return this;
    }

    public get adapter(): IDSAdapter {
        return <IDSAdapter>this.get_service("adapter", this.get_adapter_config());
    }

    public set adapter(ad: IDSAdapter) {
        this._adapter = ad;
    }

    public get_adapter_config(): any {
        return this.get_service_config("adapter");
    }

    public get backend(): IDSBackend {
        return <IDSBackend>this.get_service("backend", this.get_backend_config());
    }

    public set backend(bk: IDSBackend) {
        this._backend = bk;
    }

    public get_backend_config(): any {

        return this.get_service_config("backend");
    }

    public get serializer(): IDSSerializer {
        return <IDSSerializer>this.get_service("serializer", this.get_serializer_config());
    }

    public get_serializer_config(): any {
        return this.get_service_config("serializer");
    }

    public set serializer(sr: IDSSerializer) {
        this._serializer = sr;
    }


    public get persistence(): IDSPersistence {
        return <IDSPersistence>this.get_service("persistence", this.get_persistence_config());
    }

    public get_persistence_config(): any {
        return this.get_service_config("persistence");
    }

    public set persistence(ps: IDSPersistence) {
        this._persistence = ps;
    }


}
