import {IDSSerializer} from "./interface";
import {omitBy} from "lodash";
import {IDSModel} from "../model/interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSDefaultSerializer implements IDSSerializer {
    public serialize(instance: IDSModel): any {
        return omitBy(instance, (value, key) => {
            return (key[0] === "_") || (key[0] === "$");
        });
    }

    public deserialize(values: any): any {
        return values;
    }

    public serializeMany(instances: IDSModel[]): any {
        let serialized: any[] = [];
        for (let instance of instances) {
            serialized.push(this.serialize(instance));
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
