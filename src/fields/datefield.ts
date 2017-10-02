import { IDSModel } from "../model/interface";
import { ValidatorFn, Validators } from "@angular/forms";
import { IDSFieldBaseParameters } from "./interface";

export interface IDSDateFieldParams extends IDSFieldBaseParameters {
    auto_now?: boolean;
    auto_now_add?: boolean;
}

export function DSDateField(params: IDSDateFieldParams): any {
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
            type: "datefield",
            validators: validators,
            asyncvalidators: []
        };
    };
}
