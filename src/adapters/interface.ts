import {IDSModel} from "../model/interface";
export interface IDSAdapterIdentifierParams {
    create?: boolean;
    unsaved?: boolean;
}


export interface IDSAdapter {
    identifier(instance: IDSModel, params: IDSAdapterIdentifierParams = {}): any;
    search(params: any): any;
}
