import {Headers, Http, RequestMethod, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {IDSBackend, IDSBackendConfig, IDSBackendProvider} from "./interface";
import {Inject, Injectable, InjectionToken, Optional} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/observable/of";
import "rxjs/operator/mergeMap";
import {capitalize, defaults, isString} from "lodash-es";
import {DSConfig} from "../configuration";
import {IDSResponseParser, IDSResponseParserClass, IDSResponseParserProvider} from "../parsers/interface";
import {IDSRequestRenderer, IDSRequestRendererClass, IDSRequestRendererProvider} from "../renderers/interface";
import {IDSAuthentication, IDSAuthenticationClass, IDSAuthenticationProvider} from "../authentication/interface";

/**
 * Rest detail : parts of an url.
 */
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
    headers?: { [index: string]: string };
}

export let REST_BACKEND_CONFIG = new InjectionToken<IDSRestBackendConfig>("backend.rest.config");
export let REST_BACKEND_PARSER = new InjectionToken<IDSResponseParser>("backend.rest.parser");
export let REST_BACKEND_RENDERER = new InjectionToken<IDSRequestRenderer>("backend.rest.renderer");
export let REST_BACKEND_AUTHENTICATION = new InjectionToken<IDSAuthentication>("backend.rest.authentication");

@Injectable()
export class DSRestBackendSetup implements IDSBackendConfig {
    public constructor(@Inject(REST_BACKEND_AUTHENTICATION) public authentication: IDSAuthentication,
                       @Inject(REST_BACKEND_PARSER) public parser: IDSResponseParser,
                       @Inject(REST_BACKEND_RENDERER) public renderer: IDSRequestRenderer) {
    }

}


/**
 * Makes data requests to a REST API.
 * TODO: add custom actions.
 */
@Injectable()
export class DSRestBackend extends DSConfig<IDSBackendConfig> implements IDSBackend {
    public authentication_class: IDSAuthenticationClass;
    public authentication_provider: IDSAuthenticationProvider;
    public authentication_config: any;
    public parser_class: IDSResponseParserClass;
    public parser_provider: IDSResponseParserProvider;
    public parser_config: any;
    public renderer_class: IDSRequestRendererClass;
    public renderer_provider: IDSRequestRendererProvider;
    public renderer_config: any;
    private _defaultHeaders: { [index: string]: string } = {};
    /* tslint:disable:no-unused-variable */
    private _renderer: IDSRequestRenderer;
    private _parser: IDSResponseParser;
    private _authentication: IDSAuthentication;

    /* tslint:enable */

    constructor(private _http: Http,
                @Optional() protected setup: DSRestBackendSetup,
                @Inject(REST_BACKEND_CONFIG) protected _config: IDSRestBackendConfig) {
        super();
        this.setup = defaults(this.setup || {}, setup);
        if (this._config.headers) {
            this._defaultHeaders = this._config.headers;
        }
    }

    public retrieve(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this.renderer.prepare(options);
        return this._http
            .get(this.getRequestUrl(identifier), options)
            .map((response) => {
                return this.parser.parse(response);
            });
    }

    public list(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this.renderer.prepare(options);
        console.log("Calling list http");
        return this._http
            .get(this.getRequestUrl(identifier), options)
            .map((response) => {
                return this.parser.parse(response);
            });
    }

    public create(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this.renderer.prepare(options);
        return this._http
            .post(this.getRequestUrl(identifier), this.renderer.render(values), options)
            .map((response) => {
                return this.parser.parse(response);
            });
    }

    public update(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this.renderer.prepare(options);
        return this._http
            .put(this.getRequestUrl(identifier), this.renderer.render(values), options)
            .map((response) => {
                return this.parser.parse(response);
            });
    }

    public partial_update(identifier: IDSRestIdentifier, values: any, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this.renderer.prepare(options);
        return this._http
            .patch(this.getRequestUrl(identifier), this.renderer.render(values), options)
            .map((response) => {
                return this.parser.parse(response);
            });
    }

    public destroy(identifier: IDSRestIdentifier, params: any = {}): Observable<any> {
        let options = this.getRequestOptions(identifier);
        options = this.renderer.prepare(options);
        return this._http
            .delete(this.getRequestUrl(identifier), options)
            .map((response) => {
                if (response.status !== 204) {
                    return this.parser.parse(response);
                } else {
                    return null;
                }
            });
    }

    public action(identifier: IDSRestIdentifier, action: string, params: any = {}): Observable<any> {
        // Params : string => url
        // Params : object => {url, body}
        let options = this.getRequestOptions(identifier);
        options = this.renderer.prepare(options);
        options.method = RequestMethod[capitalize(action)];
        if (isString(params)) {
            options.url = this.getRequestUrl(identifier) + <string>params || "";
        } else {
            options.url = this.getRequestUrl(identifier) + params.url || "";
            options.body = this.renderer.render(params.body);
        }
        return this._http.request(options.url, options)
            .map((response) => {
                console.log("ACTION : ", response);
                return this.parser.parse(response);
            });
    }


    public setDefaultHeaders(headers: { [index: string]: string }): void {
        for (let h of Object.keys(headers)) {
            this._defaultHeaders[h] = headers[h];
        }
    }

    /**
     * Compute request headers.
     * @param identifier Rest detail
     * @returns {Headers} Headers object
     */
    public getRequestHeaders(identifier: IDSRestIdentifier): Headers {
        let headers = new Headers(identifier.headers || {});
        for (let h of Object.keys(this._defaultHeaders)) {
            headers.set(h, this._defaultHeaders[h]);
        }
        this.authentication.setAuthHeaders(headers);
        return headers;
    }

    /**
     * Compute request query string (search).
     * @param identifier Rest detail
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
     * Compute request url using config and detail.
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


    public get authentication(): IDSAuthentication {
        return <IDSAuthentication>this.get_service("authentication", this.get_authentication_config());
    }

    public get_authentication_config(): any {
        return this.get_service_config("authentication");
    }

    public set authentication(au: IDSAuthentication) {
        this._authentication = au;
    }

    public get renderer(): IDSRequestRenderer {
        return <IDSRequestRenderer>this.get_service("renderer", this.get_renderer_config());
    }

    public get_renderer_config(): any {
        return this.get_service_config("renderer");
    }

    public set renderer(au: IDSRequestRenderer) {
        this._renderer = au;
    }

    public get parser(): IDSResponseParser {
        return <IDSResponseParser>this.get_service("parser", this.get_parser_config());
    }

    public get_parser_config(): any {
        return this.get_service_config("parser");
    }

    public set parser(au: IDSResponseParser) {
        this._parser = au;
    }


}


@Injectable()
export class DSRestBackendProvider implements IDSBackendProvider {
    constructor(protected _http: Http,
                protected setup: DSRestBackendSetup,
                @Optional() @Inject(REST_BACKEND_CONFIG) protected _config: IDSRestBackendConfig) {

    }

    public provide(params: IDSRestBackendConfig): IDSBackend {
        return new DSRestBackend(
            this._http,
            this.setup,
            params || this._config
        );
    }
}
