import {IDSModel} from "../model/interface";
import {IDSModelList} from "../collection/interface";
import {Observable} from "rxjs";
import {IDSFilter} from "../filters/interface";
import {IDSSorter} from "../sorters/interface";
import {IDSPaginator} from "../paginators/interface";
export interface IDSQueryset<T extends IDSModel> {
    paginator: IDSPaginator;
    sorter: IDSSorter;
    filter: IDSFilter;
    all(params?: any): Observable<IDSModelList<T>>;
    query(params?: any): IDSQueryset<T>;
    sort(params?: any): IDSQueryset<T>;
    paginate(params?: any): IDSQueryset<T>;
    get(params?: any): Observable<IDSModelList<T>>;
}

export interface IDSQuerysetClass<T extends IDSModel> {
    new(params: any): IDSQueryset<T>;
}

export interface IDSQuerysetProvider<T extends IDSModel> {
    provide(params: any): IDSQueryset<T>;
}
