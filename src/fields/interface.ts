import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";


export const DSFieldMetadataKey = Symbol("ds:field");
export interface IDSFieldProperties {
    type: string;
    validators: ValidatorFn[];
    asyncvalidators: AsyncValidatorFn[];
}
export interface IDSFieldList {
    [index: string]: IDSFieldProperties;
}

export interface IDSFieldBaseParameters {
    verbose_name?: string;
    name?: string;
    help_text?: string;
    choices?: any;
    default?: any;
    required?: boolean;
    validators?: ValidatorFn[];
    asyncvalidators?: AsyncValidatorFn[];
}
