import {Headers, Http, RequestMethod, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {IDSBackend, IDSBackendProvider} from "./interface";
import {DSJsonParser} from "../parsers/json";
import {Inject, Injectable, InjectionToken, Optional} from "@angular/core";
import {DSJsonRenderer} from "../renderers/json";
import "rxjs/add/operator/map";
import "rxjs/observable/of";
import "rxjs/operator/mergeMap";
import {capitalize, isString} from "lodash";

export interface IDSRestIdentifier {
    path: string;
    query?: { [index: string]: string };
    headers?: { [index: string]: string };
}


export interface IDSRestBackendConfig {
    host: string;
    port: string;
    scheme: string;
    url?: string;
    headers?: { [index: string]: string }
}

export let REST_BACKEND_CONFIG = new InjectionToken<IDSRestBackendConfig>("backend.rest.config");

// FIXME: AOT: wait for https://github.com/angular/angular/issues/12631
/* export class DSRestBackendConfig implements IDSRestBackendConfig {
 public host: string;
 public port: string;
 public scheme: string;
 public url: string;
 public headers: {[index: string]: string}
 } */


/**
 * Makes data requests to a REST API.
 * FIXME: include authentication in backend ?
 * TODO: add custom actions.
 */
@Injectable()
export class DSRestBackend implements IDSBackend {
    private _defaultHeaders: { [index: string]: string } = {};

    constructor(private _http: Http,
                protected _parser: DSJsonParser,
                protected _renderer: DSJsonRenderer,
                @Inject(REST_BACKEND_CONFIG) protected _config: IDSRestBackendConfig) {
        if (this._config.headers) {
            this._defaultHeaders = this._config.headers;
        }
    }

    public retrieve(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this._renderer.prepare(options);
        return this._http
            .get(this.getRequestUrl(identifier), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public list(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this._renderer.prepare(options);
        console.log("Calling list http");
        return this._http
            .get(this.getRequestUrl(identifier), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public create(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this._renderer.prepare(options);
        return this._http
            .post(this.getRequestUrl(identifier), this._renderer.render(values), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public update(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this._renderer.prepare(options);
        return this._http
            .put(this.getRequestUrl(identifier), this._renderer.render(values), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public partial_update(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this._renderer.prepare(options);
        return this._http
            .patch(this.getRequestUrl(identifier), this._renderer.render(values), options)
            .map((response) => {
                return this._parser.parse(response);
            });
    }

    public destroy(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this._renderer.prepare(options);
        return this._http
            .delete(this.getRequestUrl(identifier), options)
            .map((response) => {
                if (response.status !== 204) {
                    return this._parser.parse(response);
                } else {
                    return null;
                }
            });
    }

    public action(identifier: IDSRestIdentifier, action: string, params: any = {}): Observable<any> {
        // Params : string => url
        // Params : object => {url, body}
        let options = this.getRequestOptions(identifier);
        options = this._renderer.prepare(options);
        options.method = RequestMethod[capitalize(action)];
        if (isString(params)) {
            options.url = this.getRequestUrl(identifier) + <string>params || "";
        } else {
            options.url = this.getRequestUrl(identifier) + params.url || "";
            options.body = this._renderer.render(params.body);
        }
        return this._http.request(options.url, options)
            .map((response) => {
                console.log("ACTION : ", response);
                return this._parser.parse(response);
            });
    }


    public setDefaultHeaders(headers: { [index: string]: string }): void {
        for (let h of Object.keys(headers)) {
            this._defaultHeaders[h] = headers[h];
        }
    }

    /**
     * Compute request headers.
     * @param identifier Rest identifier
     * @returns {Headers} Headers object
     */
    public getRequestHeaders(identifier: IDSRestIdentifier): Headers {
        let headers = new Headers(identifier.headers || {});
        for (let h of Object.keys(this._defaultHeaders)) {
            headers.set(h, this._defaultHeaders[h]);
        }
        return headers;
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
