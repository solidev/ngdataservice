import {Observable} from "rxjs";

export interface IDSBackend {
    retrieve(identifier: any, params: any): Observable<any>;
    list(identifier: any, params: any): Observable<any>;
    create(identifier: any, values: any, params: any): Observable<any>;
    update(identifier: any, values: any, params: any): Observable<any>;
    destroy(identifier: any, params: any): Observable<any>;
    action(identifier: any, action: string, params: any): Observable<any>;
}
export interface IDSBackendProvider {
    provide(params: any): IDSBackend;
}