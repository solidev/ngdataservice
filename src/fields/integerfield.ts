import { DSFieldMetadataKey } from "./interface";
import { IDSModel } from "../model/interface";
import { Validators, ValidatorFn } from "@angular/forms";

export interface IDSIntegerFieldParams {
    required?: boolean;
    minimum?: number;
    maximum?: number;
    validators?: ValidatorFn[];

}


export function DSIntegerField(params: IDSIntegerFieldParams): any {
    let setmeta = Reflect.metadata(DSFieldMetadataKey,
        {type: "integer", params: params});
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


        // Store metadata
        setmeta(target, key);
    };
}
