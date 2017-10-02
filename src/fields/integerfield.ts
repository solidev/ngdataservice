import { IDSFieldBaseParameters } from "./interface";
import { IDSModel } from "../model/interface";
import { Validators } from "@angular/forms";

export interface IDSIntegerFieldParams extends IDSFieldBaseParameters {
    minimum?: number;
    maximum?: number;
}


export function DSIntegerField(params: IDSIntegerFieldParams): any {
    return (target: IDSModel, key: string) => {
        // Set validators
        let validators = [];
        if (params.validators) {
            validators = params.validators;
        }
        if (params.required) {
            validators.push(Validators.required);
        }
        if (params.minimum !== null) {
            validators.push(Validators.min(params.minimum));
        }
        if (params.maximum !== null) {
            validators.push(Validators.max(params.maximum));
        }
        if (!target._fields) {
            target._fields = {};
        }
        target._fields[key] = {
            type: "integer",
            validators: validators,
            asyncvalidators: []
        };
    };
}
