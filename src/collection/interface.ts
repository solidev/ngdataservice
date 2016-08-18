import {Observable} from "rxjs/Rx";
import {IDSModel} from "../model/interface";


export interface IDSCollectionCreateParams {
    save?: boolean;
    volatile?: boolean;
}

export interface IDSCollectionGetParams {
    fromcache?: boolean;
}

export interface IDSPaginationInfo {
    currentpage?: number;
    itemsperpage?: number;
    pagescount?: number;
    itemscount?: number;
}

export interface IDSModelList<T extends IDSModel> {
    items: T[];
    pagination: IDSPaginationInfo;
}

export interface IDSCollection<T extends IDSModel> {
    save(instance: T): Observable<T>;
    update(instance: T, fields: string[]): Observable<T>;
    remove(instance: T): Observable<T>;
    refresh(instance: T): Observable<T>;
    create(values: any, params: IDSCollectionCreateParams): Observable<T>;
    get(identifier: any, params: IDSCollectionGetParams): Observable<T>;
}

export interface IDataCollectionConfig {
    base: any; // TODO: typing of IDataObject constructor
    identifier: string;
}
