import {IDSFilterFunction} from "../filters/interface";
import {IDSSorterFunction} from "../sorters/interface";
export interface IDSPersistence {
    type: string;
    save(identifier: any, data: any): any;
    retrieve(identifier: any): any;
    destroy(identifier: any): void;
    list(filter?: IDSFilterFunction, sorter?: IDSSorterFunction): any;
    clear(params: any): any;
}

export interface IDSPersistenceClass {
    new(params: any): IDSPersistence;
}

export interface IDSPersistenceProvider {
    provide(params: any): IDSPersistence;
}
