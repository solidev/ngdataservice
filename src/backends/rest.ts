import {Headers, URLSearchParams, RequestOptions, Http} from "@angular/http";
import {Observable} from "rxjs";
import {IDSBackend, IDSBackendProvider} from "./interface";
import {DSJsonParser} from "../parsers/json";
import {Injectable, OpaqueToken, Inject, Optional} from "@angular/core";
import {DSJsonRenderer} from "../renderers/json";
import "rxjs/add/operator/map";


export interface IDSRestIdentifier {
    path: string;
    query?: {[index: string]: string};
    headers?: {[index: string]: string};
}

export let REST_BACKEND_CONFIG = new OpaqueToken("backend.rest.config");

export interface IDSRestBackendConfig {
    host: string;
    port: string;
    scheme: string;
    url?: string;
}

/**
 * Makes data requests to a REST API.
 * FIXME: include authentication in backend ?
 * TODO: add custom actions.
 */
@Injectable()
export class DSRestBackend implements IDSBackend {

    constructor(private _http: Http,
                protected _parser: DSJsonParser,
                protected _renderer: DSJsonRenderer,
                @Inject(REST_BACKEND_CONFIG) protected _config: IDSRestBackendConfig) {
    }

    public retrieve(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .get(this.getRequestUrl(identifier), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public list(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .get(this.getRequestUrl(identifier), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public create(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .post(this.getRequestUrl(identifier), this._renderer.render(values), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public update(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .put(this.getRequestUrl(identifier), this._renderer.render(values), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public destroy(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        return this._http
            .delete(this.getRequestUrl(identifier), options)
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
                search.set(param, rawquery[param]);
            }
        }
        return search;
    }

    /**
     * Compute request options (path, search, headers)
     * @param identifier
     * @returns {RequestOptions} Request options
     */
    public getRequestOptions(identifier: IDSRestIdentifier): RequestOptions {
        return new RequestOptions({
            headers: this.getRequestHeaders(identifier),
            search: this.getSearchParams(identifier)
        });
    }

    /**
     * Compute request url using config and identifier.
     * TODO: check trailing slashes
     * SEE: add basePath in detailed config ?
     * SEE: add current host as default host ?
     * @param identifier
     * @returns {string}
     */
    public getRequestUrl(identifier: IDSRestIdentifier): string {
        if (this._config.url) {
            return this._config.url + identifier.path;
        } else {
            return (this._config.scheme || "http") + "://" +
                this._config.host + ":" +
                (this._config.port || "80") +
                identifier.path;
        }
    }
}


@Injectable()
export class DSRestBackendProvider implements IDSBackendProvider {
    constructor(protected _http: Http,
                protected _parser: DSJsonParser,
                protected _renderer: DSJsonRenderer,
                @Optional() @Inject(REST_BACKEND_CONFIG) protected _config: IDSRestBackendConfig) {

    }

    public provide(params: IDSRestBackendConfig): IDSBackend {
        return new DSRestBackend(
            this._http,
            this._parser,
            this._renderer,
            params || this._config
        );
    }
}