import {Observable} from "rxjs/Observable";
import {IDSCollection} from "../collection/interface";



export interface IDSValidationOptions {
    validate?: boolean;
    async?: boolean;
}

export interface IDSValidationError {
    field: string;
    errors: string[];
}
export type IDSValidationResult = boolean | IDSValidationError[] |
    Observable<boolean> | Observable<IDSValidationError>;


export interface IDSModel {
    _pk: number|string;
    _local: number|string;
    id?: number|string;
    assign(values: any): IDSValidationResult;
    save(): Observable<IDSModel>;
    update(fields: string[]): Observable<IDSModel>;
    remove(): Observable<IDSModel>;
    refresh(): Observable<IDSModel>;
    validate(data: any, options: IDSValidationOptions): IDSValidationResult;
    dirty(fields: string[]): string[];
}

export interface IDSModelClass<T extends IDSModel> {
    new(collection: IDSCollection<T>,
        values: any): T;
}


export interface IDSModelConfig {
    pk: string;
    identifier: string;
    fields: any;
}
