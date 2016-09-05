import {Observer} from "rxjs";
export type IDSFilterFunction = (item: any) => boolean;

export interface IDSFilterField {
    name: string;
    params: any;
    value: any;
}

export interface IDSFilter {
    listener: Observer<any>;
    fields: {[index: string]: IDSFilterField};
    backendFilter: any;
    localFilter: IDSFilterFunction;
    update(filter_params: any): void;
}

export interface IDSFilterProvider {
    provide(params: any): IDSFilter;
}
