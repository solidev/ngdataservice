import {IDSModel} from "../model/interface";
export interface IDataAdapterIdentifierParams {
    create?: boolean;
    unsaved?: boolean;
}


export interface IDSSerializer {
    serialize(instance: IDSModel): any;
    deserialize(values: any): any;
    serializeMany(instances: IDSModel[]): any;
    deserializeMany(result: any): any;
}

export interface IDSSerializerClass {
    new(params: any): IDSSerializer;
}

export interface IDSSerializerProvider {
    provide(params: any): IDSSerializer;
}
