import { IDSModel } from "../model/interface";
import { ValidatorFn, Validators } from "@angular/forms";
import { IDSFieldBaseParameters } from "./interface";

export interface IDSAutoFieldParams extends IDSFieldBaseParameters {
}

export function DSAutoField(params: IDSAutoFieldParams): any {
    return (target: IDSModel, key: string) => {
        // Set validators
        let validators = [];
        if (params.validators) {
            validators = params.validators;
        }
        if (params.required) {
            validators.push(Validators.required);
        }
        if (!target._fields) {
            target._fields = {};
        }
        target._fields[key] = {
            type: "autofield",
            validators: validators,
            asyncvalidators: []
        };
    };
}
