import {IDataAdapter, IDataAdapterIdentifierParams} from "./interface";
import {IDataObject} from "../../../dataobject/interface";
import {omitBy} from "lodash";
import {IRestIdentifier} from "../rest";

class SingleRestAdapter implements IDataAdapter {
    public serialize(instance: IDataObject): any {
        return omitBy(instance, (value, key) => {
            return (key[0] === "_") || (key[0] === "$");
        });
    }

    public deserialize(values: any, instance: IDataObject = null): any {
        if (instance) {
            instance.assign(values);
            return instance;
        } else {
            return values;
        }
    }

    public serializeMany(instances: IDataObject[]): any {
        let serialized: any[] = [];
        for (let instance of instance) {
            serialized.push(this.serialize(instance));
        }
        return serialized;

    }

    public deserializeMany(result: any, instances: IDataObject[]): any {
        let deserialized: any[] = [];
        for (let res of result) {
            deserialized.push(this.deserialize(res));
        }
        return deserialized;
    }

    public identifier(instance: IDataObject, params: IDataAdapterIdentifierParams = {}): IRestIdentifier {
        return {
            url: "http://todo",
            headers: {},
            search: {}
        };
    }

    public search(params: any): any {
        return {
            url: "http://todo",
            headers: {},
            search: {}
        };
    }
}
