import {Observable} from "rxjs/Rx";
import {IDSModel, IDSModelConstructor} from "../model/interface";
import {IDSAuthenticationProvider, IDSAuthentication} from "../authentication/interface";
import {IDSPaginatorProvider, IDSPaginator} from "../paginators/interface";
import {IDSPersistenceProvider, IDSPersistence} from "../persistence/interface";
import {IDSSerializerProvider, IDSSerializer} from "../serializers/interface";
import {IDSBackendProvider, IDSBackend} from "../backends/interface";
import {IDSAdapterProvider, IDSAdapter} from "../adapters/interface";
import {IDSFilter, IDSFilterProvider} from "../filters/interface";
import {IDSSorterProvider, IDSSorter} from "../sorters/interface";


export interface IDSCollectionCreateParams {
    save?: boolean;
    volatile?: boolean;
}

export interface IDSCollectionGetParams {
    fromcache?: boolean;
}

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

export interface IDSCollection<T extends IDSModel> {
    model: IDSModelConstructor<T>;
    save(instance: T): Observable<T>;
    update(instance: T, fields: string[]): Observable<T>;
    remove(instance: T | number | string): Observable<any>;
    refresh(instance: T): Observable<T>;
    create(values: any, params?: IDSCollectionCreateParams): Observable<T>;
    get(identifier: any, params?: IDSCollectionGetParams): Observable<T>;
    action?(instance: T, action: string, params: any): Observable<any>;
    list(filter: any, params?: IDSCollectionGetParams): Observable<IDSModelList<T>>;
    all(params?: IDSCollectionGetParams): Observable<IDSModelList<T>>;
}


export interface IDSCollectionConstructor<T extends IDSModel> {
    new(setup: IDSCollectionSetup, context?: any): IDSCollection<T>;
}

export interface IDataCollectionConfig {
    base: any; // TODO: typing of IDataObject constructor
    identifier: string;
}


export interface IDSCollectionSetup {
    adapter?: IDSAdapter;
    adapter_provider?: IDSAdapterProvider;
    adapter_config?: any;
    backend?: IDSBackend;
    backend_provider?: IDSBackendProvider;
    backend_config?: any;
    authentication?: IDSAuthentication;
    authentication_provider?: IDSAuthenticationProvider;
    authentication_config?: any;
    serializer?: IDSSerializer;
    serializer_provider?: IDSSerializerProvider;
    serializer_config?: any;
    persistence?: IDSPersistence;
    persistence_provider?: IDSPersistenceProvider;
    persistence_config?: any;
    paginator?: IDSPaginator;
    paginator_provider?: IDSPaginatorProvider;
    paginator_config?: any;
    filter?: IDSFilter;
    filter_provider?: IDSFilterProvider;
    filter_config?: any;
    sorter?: IDSSorter;
    sorter_provider?: IDSSorterProvider;
    sorter_config?: any;
}

export const COLLECTION_SETUP_NAMES: string[] = [
    "adapter", "adapter_provider", "adapter_config",
    "backend", "backend_provider", "backend_config",
    "authentication", "authentication_provider", "authentication_config",
    "serializer", "serializer_provider", "serializer_config",
    "persistence", "persistence_provider", "persistence_config",
    "paginator", "paginator_provider", "paginator_config",
    "filter", "filter_provider", "filter_config",
    "sorter", "sorter_provider", "sorter_config"
];
