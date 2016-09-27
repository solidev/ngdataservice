import {Observer} from "rxjs";

export type IDSSorterFunction = (item1: any, item2: any) => number;

export interface IDSSorterField {
    field: string;
    up: boolean;
}

export type IDSSorterUpdateParams = any;

export interface IDSSorter {
    fields: IDSSorterField[];
    listener: Observer<any>;
    localSorter: IDSSorterFunction;
    backendSorter: any;
    update(sorter_params: any, params?: IDSSorterUpdateParams): void;
}

export interface IDSSorterClass {
    new(params: any): IDSSorter;
}

export interface IDSSorterProvider {
    provide(params: any): IDSSorter;
}
