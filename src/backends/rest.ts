import {Headers, URLSearchParams, RequestOptions, Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {IDSBackend} from "./interface";
import {DSJsonParser} from "../parsers/json";
import {Injectable} from "@angular/core";
import {DSJsonRenderer} from "../renderers/json";


export interface IDSRestIdentifier {
    url: string;
    query?: {[index: string]: string};
    headers?: {[index: string]: string};
}


/**
 * Makes data requests to a REST API.
 */
@Injectable()
export class RestDataBackend implements IDSBackend {

    constructor(private _http: Http,
                protected _parser: DSJsonParser,
                protected _renderer: DSJsonRenderer) {
    }

    public retrieve(identifier: IDSRestIdentifier, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .get(identifier.url, options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public list(identifier: IDSRestIdentifier, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .get(identifier.url, options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public create(identifier: IDSRestIdentifier, values: any, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .post(identifier.url, this._renderer.render(values), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public update(identifier: IDSRestIdentifier, values: any, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .put(identifier.url, this._renderer.render(values), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public destroy(identifier: IDSRestIdentifier, params: any): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .delete(identifier.url, options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }


    /**
     * Compute request headers.
     * @param identifier Rest identifier
     * @returns {Headers} Headers object
     */
    public getRequestHeaders(identifier: IDSRestIdentifier): Headers {
        return new Headers(identifier.headers || {});
    }

    /**
     * Compute request query string (search).
     * @param identifier Rest identifier
     * @returns {URLSearchParams} Url search params option
     */
    public getSearchParams(identifier: IDSRestIdentifier): URLSearchParams {
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
    public getRequestOptions(identifier: IDSRestIdentifier): RequestOptions {
        return new RequestOptions({
            headers: this.getRequestHeaders(identifier),
            search: this.getSearchParams(identifier)
        });
    }
}
