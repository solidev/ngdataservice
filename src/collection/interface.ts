import {Observable} from "rxjs/Rx";
import {IDataObject} from "../dataobject/interface";


export interface IDataCollectionCreateParams {
    save?: boolean;
    volatile?: boolean;
}

export interface IDataCollectionGetParams {
    fromcache?: boolean;
}

export interface IDataPagination {
    currentpage?: number;
    itemsperpage?: number;
    pagescount?: number;
    itemscount?: number;
}

export interface IDataObjectList<IDataObject> {
    items: IDataObject[];
    pagination: IDataPagination;
}

export interface IDataCollection {
    save(instance: IDataObject): Observable<IDataObject>;
    update(instance: IDataObject, fields: string[]): Observable<IDataObject>;
    remove(instance: IDataObject): Observable<IDataObject>;
    refresh(instance: IDataObject): Observable<IDataObject>;
    create(values: any, params: IDataCollectionCreateParams): Observable<IDataObject>;
    get(identifier: any, params: IDataCollectionGetParams): Observable<IDataObject>;
}

export interface IDataCollectionConfig {
    base: any; // TODO: typing of IDataObject constructor
    identifier: string;
}
