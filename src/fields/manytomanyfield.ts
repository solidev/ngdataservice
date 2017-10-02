import { IDSModel } from "../model/interface";
import { Validators } from "@angular/forms";
import { IDSFieldBaseParameters } from "./interface";

export interface IDSManyToManyFieldParams extends IDSFieldBaseParameters {
}

export function DSManyToManyField(params: IDSManyToManyFieldParams): any {
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
            type: "manytomanyfield",
            validators: validators,
            asyncvalidators: []
        };
    };
}
