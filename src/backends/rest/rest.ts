import {Headers, URLSearchParams, RequestOptions, Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {IDataBackend} from "../interface";
import {IRestFormatter} from "./formatters/interface";
import {JsonRestFormatter} from "./formatters/json";


export interface IRestIdentifier {
    url: string;
    query?: {[index: string]: string};
    headers?: {[index: string]: string};
}


/**
 * Makes data requests to a REST API.
 */
export class RestDataBackend implements IDataBackend {
    protected _formatter: IRestFormatter;

    constructor(private _http: Http) {
        this._formatter = new JsonRestFormatter();
    }

    public retrieve(identifier: IRestIdentifier, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .get(identifier.url, options)
            .map((response) => {
                return this._formatter.fromResponse(response);
            });
    }

    public list(identifier: IRestIdentifier, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .get(identifier.url, options)
            .map((response) => {
                return this._formatter.fromResponse(response);
            });
    }

    public create(identifier: IRestIdentifier, values: any, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .post(identifier.url, this._formatter.toRequest(values), options)
            .map((response) => {
                return this._formatter.fromResponse(response);
            });
    }

    public update(identifier: IRestIdentifier, values: any, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .put(identifier.url, this._formatter.toRequest(values), options)
            .map((response) => {
                return this._formatter.fromResponse(response);
            });
    }

    public destroy(identifier: IRestIdentifier, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .delete(identifier.url, options)
            .map((response) => {
                return this._formatter.fromResponse(response);
            });
    }


    /**
     * Compute request headers.
     * @param identifier Rest identifier
     * @returns {Headers} Headers object
     */
    public getRequestHeaders(identifier: IRestIdentifier): Headers {
        let headers = new Headers(identifier.headers || {});
        return headers;
    }

    /**
     * Compute request query string (search).
     * @param identifier Rest identifier
     * @returns {URLSearchParams} Url search params option
     */
    public getSearchParams(identifier: IRestIdentifier): URLSearchParams {
        let search: URLSearchParams = new URLSearchParams();
        let rawquery = identifier.query || {};
        for (let param in rawquery) {
            if (rawquery.hasOwnProperty(param)) {
                search.set(param, rawquery["param"]);
            }
        }
        return search;
    }

    /**
     * Compute request options (url, search, headers)
     * @param identifier
     * @returns {RequestOptions} Request options
     */
    public getRequestOptions(identifier: IRestIdentifier): RequestOptions {
        let ro = new RequestOptions({
            headers: this.getRequestHeaders(identifier),
            search: this.getSearchParams(identifier)
        });
        return ro;

    }
}
