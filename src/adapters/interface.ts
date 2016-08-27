import {IDSModel} from "../model/interface";

// TODO: make filter-aware IDSAdapterIdentifierParams
export interface IDSAdapterIdentifierParams {
    create?: boolean;
    unsaved?: boolean;
}

export interface IDSAdapterSearchParams {
    search?: any;
}

export interface IDSAdapter {
    identifier(instance: IDSModel, params?: IDSAdapterIdentifierParams): any;
    search(params?: IDSAdapterSearchParams): any;
}

export interface IDSAdapterProvider {
    provide(config: any): IDSAdapter;
}
