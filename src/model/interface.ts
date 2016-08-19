import {Observable} from "rxjs/Rx";
import {IDSCollection} from "../collection/interface";



export interface IDSModel {
    pk: number|string;
    assign(values: any): IDSModel;
    save(): Observable<IDSModel>;
    update(fields: string[]): Observable<IDSModel>;
    remove(): Observable<IDSModel>;
    refresh(): Observable<IDSModel>;
    validate(): Observable<IDSModel>;
}

export interface IDSModelConstructor<T extends IDSModel> {
    new(collection: IDSCollection<T>,
        values: any): T;
}


export interface IDSModelConfig {
    pk: string;
    identifier: string;
    fields: any;
}
