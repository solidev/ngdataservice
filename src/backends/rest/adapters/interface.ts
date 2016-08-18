import {IDataObject} from "../../../dataobject/interface";

export interface IDataAdapterIdentifierParams {
    create?: boolean;
    unsaved?: boolean;
}


export interface IDataAdapter {
    serialize(instance: IDataObject): any;
    deserialize(values: any, instance: IDataObject = null): any;
    serializeMany(instances: IDataObject[]): any;
    deserializeMany(result: any, instances: IDataObject[]): any;
    identifier(instance: IDataObject, params: IDataAdapterIdentifierParams = {}): any;
    search(params: any): any;
}
