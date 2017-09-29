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
