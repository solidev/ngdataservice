import { IDSModel } from "../model/interface";
import { ValidatorFn, Validators } from "@angular/forms";
import { IDSFieldBaseParameters } from "./interface";

export interface IDSDateTimeFieldParams extends IDSFieldBaseParameters {
    auto_now?: boolean;
    auto_now_add?: boolean;
}

export function DSDateTimeField(params: IDSDateTimeFieldParams): any {
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
            type: "datetimefield",
            validators: validators,
            asyncvalidators: []
        };
    };
}
