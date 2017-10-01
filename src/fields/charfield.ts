import { DSFieldMetadataKey } from "./interface";
import { IDSModel } from "../model/interface";
import { ValidatorFn, Validators } from "@angular/forms";

export interface IDSCharFieldParams {
    required?: boolean;
    min_length?: number;
    max_length?: number;
    validators?: ValidatorFn[];
}

export function DSCharField(params: IDSCharFieldParams): any {
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
            type: "charfield",
            validators: validators,
            asyncvalidators: []
        };
    };
}
