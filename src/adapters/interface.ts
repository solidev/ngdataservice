import { IDSModel } from "../model/interface";
import { IDSContext } from "../collection/interface";

// FIXME: add options detailed interface
export interface IDSAdapterDetailParams {
    local?: boolean;                        // returns model's local detail
    create?: boolean;                       // returns creation detail
    context?: IDSContext;                   // context used for detail creation
    options?: any;                          // precisions for format
}


export type IDSAdapterFilterParams = any;
export type IDSAdapterSorterParams = any;
export type IDSAdapterPaginatorParams = any;


export interface IDSAdapterListParams {
    filter?: IDSAdapterFilterParams;
    sorter?: IDSAdapterSorterParams;
    paginator?: IDSAdapterPaginatorParams;
    context?: IDSContext;
    options?: any;
}


export interface IDSAdapter {
    detail(instance: IDSModel | number | string,   // instance or detail used to build adapted detail
           params?: IDSAdapterDetailParams): any;
    list(params: IDSAdapterListParams): any;
}


export interface IDSAdapterClass {
    new(config: any): IDSAdapter;
}

export interface IDSAdapterProvider {
    provide(config: any): IDSAdapter;
}
