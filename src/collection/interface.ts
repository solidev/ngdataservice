import {Observable} from "rxjs/Rx";
import {IDSModel, IDSModelClass} from "../model/interface";
import {IDSAuthenticationProvider, IDSAuthentication, IDSAuthenticationClass} from "../authentication/interface";
import {IDSPaginatorProvider, IDSPaginator, IDSPaginatorClass} from "../paginators/interface";
import {IDSPersistenceProvider, IDSPersistence, IDSPersistenceClass} from "../persistence/interface";
import {IDSSerializerProvider, IDSSerializer, IDSSerializerClass} from "../serializers/interface";
import {IDSBackendProvider, IDSBackend, IDSBackendClass} from "../backends/interface";
import {IDSAdapterProvider, IDSAdapter, IDSAdapterClass} from "../adapters/interface";
import {IDSFilter, IDSFilterProvider, IDSFilterClass} from "../filters/interface";
import {IDSSorterProvider, IDSSorter, IDSSorterClass} from "../sorters/interface";
import {IDSRegister} from "../register/interface";
import {IDSQueryset} from "../queryset/interface";


export type IDSContext = {[index: string]: any};


export interface IDSPaginationInfo {
    currentpage?: number;
    itemsperpage?: number;
    pagescount?: number;
    itemscount?: number;
}

export interface IDSModelList<T extends IDSModel> {
    items: T[];
    pagination?: IDSPaginationInfo;
}


export interface IDSCollectionSetup {
    adapter?: IDSAdapter;
    adapter_class?: IDSAdapterClass;
    adapter_provider?: IDSAdapterProvider;
    adapter_config?: any;
    backend?: IDSBackend;
    backend_class?: IDSBackendClass;
    backend_provider?: IDSBackendProvider;
    backend_config?: any;
    authentication?: IDSAuthentication;
    authentication_class?: IDSAuthenticationClass;
    authentication_provider?: IDSAuthenticationProvider;
    authentication_config?: any;
    serializer?: IDSSerializer;
    serializer_class?: IDSSerializerClass;
    serializer_provider?: IDSSerializerProvider;
    serializer_config?: any;
    persistence?: IDSPersistence;
    persistence_class?: IDSPersistenceClass;
    persistence_provider?: IDSPersistenceProvider;
    persistence_config?: any;
    paginator?: IDSPaginator;
    paginator_class?: IDSPaginatorClass;
    paginator_provider?: IDSPaginatorProvider;
    paginator_config?: any;
    datasources?: IDSRegister;
    filter?: IDSFilter;
    filter_class?: IDSFilterClass;
    filter_provider?: IDSFilterProvider;
    filter_config?: any;
    sorter?: IDSSorter;
    sorter_class?: IDSSorterClass;
    sorter_provider?: IDSSorterProvider;
    sorter_config?: any;
}

export interface IDSCollectionCreateParams {
    save?: boolean;
    volatile?: boolean;
    context?: IDSContext;
}

export interface IDSCollectionGetParams {
    fromcache?: boolean;
    context?: IDSContext;
}

export type IDSCollectionSaveParams = any;
export type IDSCollectionUpdateParams = any;
export type IDSCollectionRemoveParams = any;
export type IDSCollectionRefreshParams = any;
export type IDSCollectionActionParams = any;

export interface IDSCollection<T extends IDSModel> {
    model: IDSModelClass<T>;
    context: IDSContext;
    setup: IDSCollectionSetup;
    datasources: IDSRegister;
    queryset: IDSQueryset<T>;
    adapter: IDSAdapter;
    backend: IDSBackend;
    serializer: IDSSerializer;
    persistence: IDSPersistence;
    authentication: IDSAuthentication;

    save(instance: T, params?: IDSCollectionSaveParams): Observable<T>;
    update(instance: T, fields: string[], params?: IDSCollectionUpdateParams): Observable<T>;
    remove(instance: T | number | string, params?: IDSCollectionRemoveParams): Observable<any>;
    refresh(instance: T, params?: IDSCollectionRefreshParams): Observable<T>;
    create(values: any, params?: IDSCollectionCreateParams): Observable<T>;
    get(identifier: any, params?: IDSCollectionGetParams): Observable<T>;
    action?(instance: T, action: string, params?: IDSCollectionActionParams): Observable<any>;
}


export interface IDSCollectionConstructor<T extends IDSModel> {
    new(setup: IDSCollectionSetup, context?: IDSContext): IDSCollection<T>;
}

export const COLLECTION_SETUP_NAMES: string[] = [
    "adapter", "adapter_class", "adapter_provider", "adapter_config",
    "backend", "backend_class", "backend_provider", "backend_config",
    "authentication", "authentication_class", "authentication_provider", "authentication_config",
    "serializer", "serializer_class", "serializer_provider", "serializer_config",
    "persistence", "persistence_class", "persistence_provider", "persistence_config",
    "paginator", "paginator_class", "paginator_provider", "paginator_config",
    "filter", "filter_class", "filter_provider", "filter_config",
    "sorter", "sorter_class", "sorter_provider", "sorter_config", "datasources"
];
