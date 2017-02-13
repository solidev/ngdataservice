import {Observer} from "rxjs/Observer";
export type IDSFilterFunction = (item: any) => boolean;

export interface IDSFilterFieldFull {
    name: string;
    params: any;
    value: any;
}

export interface IDSFilterUpdateParams {
    partial?: boolean;
}
export type IDSFilterField = IDSFilterFieldFull | string;

export interface IDSFilter {
    listener: Observer<any>;
    fields: {[index: string]: IDSFilterField};
    backendFilter: any;
    localFilter: IDSFilterFunction;
    update(filter_params: any, params?: IDSFilterUpdateParams): void;
}

export interface IDSFilterClass {
    new(params: any): IDSFilter;
}

export interface IDSFilterProvider {
    provide(params: any): IDSFilter;
}
