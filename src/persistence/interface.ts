import {IDSFilterFunction} from "../filters/interface";
import {IDSSorterFunction} from "../sorters/interface";

export type IDSPersistenceSaveParams = any;
export type IDSPersistenceRetrieveParams = any;
export type IDSPersistenceDestroyParams = any;
export type IDSPersistenceListParams = any;
export type IDSPersistenceClearParams = any;

export interface IDSPersistence {
    type: string;
    save(identifier: any, data: any, params?: IDSPersistenceSaveParams): any;
    retrieve(identifier: any, params?: IDSPersistenceRetrieveParams): any;
    destroy(identifier: any, params?: IDSPersistenceDestroyParams): void;
    list(filter?: IDSFilterFunction, sorter?: IDSSorterFunction, params?: IDSPersistenceListParams): any;
    clear(params?: IDSPersistenceClearParams): any;
}

export interface IDSPersistenceClass {
    new(params: any): IDSPersistence;
}

export interface IDSPersistenceProvider {
    provide(params: any): IDSPersistence;
}
