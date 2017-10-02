import { IDSModel } from "../model/interface";
import { ValidatorFn, Validators } from "@angular/forms";
import { IDSFieldBaseParameters } from "./interface";

export interface IDSForeignKeyFieldParams extends IDSFieldBaseParameters {
    remote_field?: string;
    related_name?: string;
    related_model?: string;
    auto_created?: boolean;
    multiple?: boolean;
}

export function DSForeignKeyField(params: IDSForeignKeyFieldParams): any {
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
            type: "foreignKeyfield",
            validators: validators,
            asyncvalidators: []
        };
    };
}
