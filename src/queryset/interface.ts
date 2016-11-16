import {IDSModel} from "../model/interface";
import {IDSModelList} from "../collection/interface";
import {Observable} from "rxjs/Observable";
import {IDSFilter} from "../filters/interface";
import {IDSSorter} from "../sorters/interface";
import {IDSPaginator} from "../paginators/interface";

export type IDSQuerysetAllParams = any;
export type IDSQuerysetQueryParams = any;
export type IDSQuerysetSortParams = any;
export type IDSQuerysetPaginateParams = any;
export type IDSQuerysetGetParams = any;



export interface IDSQueryset<T extends IDSModel> {
    paginator: IDSPaginator;
    sorter: IDSSorter;
    filter: IDSFilter;
    all(params?: IDSQuerysetAllParams): Observable<IDSModelList<T>>;
    query(params?: IDSQuerysetQueryParams): IDSQueryset<T>;
    sort(params?: IDSQuerysetSortParams): IDSQueryset<T>;
    paginate(params?: IDSQuerysetPaginateParams): IDSQueryset<T>;
    get(params?: IDSQuerysetGetParams): Observable<IDSModelList<T>>;
}

export interface IDSQuerysetClass<T extends IDSModel> {
    new(params: any): IDSQueryset<T>;
}

export interface IDSQuerysetProvider<T extends IDSModel> {
    provide(params: any): IDSQueryset<T>;
}
