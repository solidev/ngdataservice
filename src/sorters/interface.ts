import {Observer} from "rxjs";

export type IDSSorterFunction = (item1: any, item2: any) => number;

export interface IDSSorterField {
    field: string;
    up: boolean;
}

export interface IDSSorter {
    fields: IDSSorterField[];
    listener: Observer;
    localSorter: IDSSorterFunction;
    backendSorter: any;
    update(sorter_params: any): void;
}

export interface IDSSorterProvider {
    provider(params: any): IDSSorter;
}
