import {IDSModel} from "../model/interface";
import {IDSContext} from "../collection/interface";

export interface IDSAdapterIdentifierParams {
    local?: boolean;                        // returns model's local identifier
    create?: boolean;                       // returns creation identifier
    context?: IDSContext;                   // context used for identifier creation
    options?: any;                          // precisions for format
}

export type IDSAdapterFilterParams  = any;
export type IDSAdapterSorterParams = any;
export type IDSAdapterPaginatorParams = any;


export interface IDSAdapterSearchParams {
    filter?: IDSAdapterFilterParams;
    sorter?: IDSAdapterSorterParams;
    paginator?: IDSAdapterPaginatorParams;
    context?: IDSContext;
    options?: any;
}



export interface IDSAdapter {
    identifier(instance: IDSModel | number | string,   // instance or identifier used to build adapted identifier
               params?: IDSAdapterIdentifierParams): any;
    search(params: IDSAdapterSearchParams): any;
}


export interface IDSAdapterClass {
    new(config: any): IDSAdapter;
}

export interface IDSAdapterProvider {
    provide(config: any): IDSAdapter;
}
