import {IDSModel} from "../model/interface";
import {IDSContext} from "../collection/interface";

export interface IDSSerializerSerializeParams {
    context: IDSContext;
}

export interface IDSSerializerDeserializeParams {
    context: IDSContext;
}

export type IDSSerializerSerializeManyParams = any;
export type IDSSerializerDeserializeManyParams = any;


export interface IDSSerializer {
    serialize(instance: IDSModel, context: IDSContext, fields: string[]): any;
    deserialize(values: any, context: IDSContext): any;
    serializeMany(instances: IDSModel[], context: IDSContext, fields: string[]): any;
    deserializeMany(result: any, context: IDSContext): any;
}

export interface IDSSerializerClass {
    new(params: any, context: IDSContext): IDSSerializer;
}

export interface IDSSerializerProvider {
    provide(params: any): IDSSerializer;
}
