import {IDSModel} from "../model/interface";

export interface IDSAdapterIdentifierParams {
    local?: boolean; // returns model's local identifier
    create?: boolean; // returns creation identifier
}

export type IDSAdapterFilterParams  = any;
export type IDSAdapterSorterParams = any;

export interface IDSAdapter {
    identifier(instance: IDSModel | number | string, params?: IDSAdapterIdentifierParams): any;
    search(filter?: IDSAdapterFilterParams, sorter?: IDSAdapterSorterParams): any;
}


export interface IDSAdapterClass {
    new(config: any): IDSAdapter;
}

export interface IDSAdapterProvider {
    provide(config: any): IDSAdapter;
}
