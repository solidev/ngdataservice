import {Observable} from "rxjs/Rx";
import {IDataCollection} from "../collection/interface";



export interface IDataObject {
    pk: number|string;
    assign(values: any): IDataObject;
    save(): Observable<IDataObject>;
    update(fields: string[]): Observable<IDataObject>;
    remove(): Observable<IDataObject>;
    refresh(): Observable<IDataObject>;
    validate(): Observable<IDataObject>;
}

export interface IDataObjectConstructor<T> {
    new(collection: IDataCollection,
        values: any = {}): T;
}


export interface IDataObjectConfig {
    pk: string;
    identifier: string;
    fields: any;
}
