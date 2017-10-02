import { IDSModel } from "../model/interface";
import { Validators } from "@angular/forms";
import { IDSFieldBaseParameters } from "./interface";

export interface IDSTextFieldParams extends IDSFieldBaseParameters {
    min_length?: number;
    max_length?: number;
}

export function DSTextField(params: IDSTextFieldParams): any {
    return (target: IDSModel, key: string) => {
        // Set validators
        let validators = [];
        if (params.validators) {
            validators = params.validators;
        }
        if (params.required) {
            validators.push(Validators.required);
        }
        if (params.min_length !== null) {
            validators.push(Validators.minLength(params.min_length));
        }
        if (params.max_length !== null) {
            validators.push(Validators.maxLength(params.max_length));
        }
        if (!target._fields) {
            target._fields = {};
        }
        target._fields[key] = {
            type: "textfield",
            validators: validators,
            asyncvalidators: []
        };
    };
}
