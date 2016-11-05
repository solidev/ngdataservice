import {IDSSerializer, IDSSerializerProvider} from "./interface";
import * as omitBy from "lodash/omitBy";
import * as pick from "lodash/pick";
import {IDSModel} from "../model/interface";
import {Injectable} from "@angular/core";
import {IDSContext} from "../collection/interface";

@Injectable()
export class DSDefaultSerializer implements IDSSerializer {
    public serialize(instance: IDSModel, context: IDSContext = {}, fields: string[] = []): any {
        let obj: any;
        if (fields.length > 0) {
            obj = pick(instance, fields);
        } else {
            obj = instance;
        }
        return omitBy(obj, (value, key) => {
            return (key[0] === "_") || (key[0] === "$") || key[key.length - 1] === "$";
        });
    }

    public deserialize(values: any): any {
        return values;
    }

    public serializeMany(instances: IDSModel[], context: IDSContext = {}, fields: string[] = []): any {
        let serialized: any[] = [];
        for (let instance of instances) {
            serialized.push(this.serialize(instance, fields));
        }
        return serialized;

    }

    public deserializeMany(result: any): any {
        let deserialized: any[] = [];
        for (let res of result) {
            deserialized.push(this.deserialize(res));
        }
        return deserialized;
    }
}

@Injectable()
export class DSDefaultSerializerProvider implements IDSSerializerProvider {
    public provide(params: any): IDSSerializer {
        return new DSDefaultSerializer();
    }
}
