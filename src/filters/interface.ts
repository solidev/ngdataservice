import {Observer} from "rxjs";
export type IDSFilterFunction = (item: any) => boolean;

export interface IDSFilterField {
    name: string;
    params: any;
    value: any;
}

export interface IDSFilter {
    listener: Observer;
    fields: {[index: string]: IDSFilterField};
    localFilter: IDSFilterFunction;
    backendFilter: any;
    update(filter_params: any): void;
}

export interface IDSFilterProvider {
    provide(params: any): IDSFilter;
}
