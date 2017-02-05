import {Observable} from "rxjs/Observable";
import {IDSCollection, IDSCollectionActionParams} from "../collection/interface";


export interface IDSRemoveParams {
    [index:string]: any
}

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
    assign(values: any, context: any): IDSValidationResult;
    save(): Observable<IDSModel>;
    update(fields: string[]): Observable<IDSModel>;
    remove(params: IDSRemoveParams): Observable<IDSModel>;
    action(action: string, params: IDSCollectionActionParams): Observable<any>;
    refresh(): Observable<IDSModel>;
    validate(data: any, options: IDSValidationOptions): IDSValidationResult;
    dirty(fields: string[]): string[];
}

export interface IDSModelClass<T extends IDSModel> {
    new(collection: IDSCollection<T>,
        values: any,
        context: any): T;
}


export interface IDSModelConfig {
    pk: string;
    identifier: string;
    fields: any;
}
