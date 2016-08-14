import {Headers, URLSearchParams, RequestOptions, Http} from "@angular/http";
import {defaults} from "lodash";
import {Observable} from "rxjs/Rx";
import {IAuthService} from "../auth";

/**
 * Makes data requests to a REST API.
 */
export class DataRequest {

    constructor(private _auth:IAuthService, private _http:Http, private params: any = {}) {
    }

    /**
     * Compute request headers.
     * @param base base headers
     * @param params datarequest params (authenticated : true/false)
     * @returns {Headers} Headers object
     */
    public getRequestHeaders(base:any = {}):Headers {
        let headers = new Headers(
            defaults({
                "Content-Type": "application/json"
            }, base));
        if (this.params.authenticated) {
            headers = this._auth.setAuthHeader(headers);
        }
        console.log("Headers in grh", headers, this.params.authenticated);
        return headers;
    }

    /**
     * Compute request options.
     * @param headers headers to use
     * @param search search parameters
     * @returns {RequestOptions}
     */
    public getRequestOptions(headers:any = {}, search:any = {}):RequestOptions {
        console.log("Headers in gro", headers);
        let ro = new RequestOptions({
            headers: <any>this.getRequestHeaders(headers).toJSON(),
            search: new URLSearchParams(search)
        });
        console.log(ro.headers);
        return ro;
    }

    /**
     * Retrieve one object.
     * @param url object url
     * @param search search params
     * @param headers headers
     * @returns {Observable<any>} decoded data
     */
    public retrieveOne(url:string, search:any = {}, headers:any = {}):Observable<any> {
        let options = this.getRequestOptions(headers, search);
        return this._http
            .get(url, options)
            .map((result) => {
                return result.json();
            });
    }

    /**
     * Retrieve a list of objects
     * @param url object url
     * @param search search params
     * @param headers headers
     * @returns {Observable<any>} decoded list data
     */
    public retrieveList(url:string, search:any = {}, headers:any = {}):Observable<any> {
        console.log("Requesting url", url);
        let options = this.getRequestOptions(headers, search);
        return this._http
            .get(url, options)
            .map((result) => {
                console.log("Getlist result", result);
                let res = result.json();
                return {_meta: {parameters: res.parameters, nav: res.nav}, data: res.results};
            });
    }

    /**
     * Create an object using POST.
     * @param url object url
     * @param data data object
     * @param search search params
     * @param headers headers
     * @returns {Observable<any>} object from api
     */

    public create(url:string, data:any, search:any = {}, headers:any = {}):Observable<any> {
        let options = this.getRequestOptions(headers, search);
        return this._http
            .post(url, JSON.stringify(data), options)
            .map((result) => {
                return result.json();
            });
    }

    /**
     * Update an object using PATCH
     * @param url
     * @param data
     * @param search
     * @param headers
     * @returns {Observable<any>} object from api
     */
    public update(url:string, data:any, search:any = {}, headers:any = {}):Observable<any> {
        let options = this.getRequestOptions(headers, search);
        return this._http
            .patch(url, JSON.stringify(data), options)
            .map((result) => {
                return result.json();
            });
    }

    /**
     * Update an object using PUT
     * @param url
     * @param data
     * @param search
     * @param headers
     * @returns {Observable<any>} object from api
     */
    public replace(url:string, data:any, search:any = {}, headers:any = {}):Observable<any> {
        let options = this.getRequestOptions(headers, search);
        return this._http
            .put(url, JSON.stringify(data), options)
            .map((result) => {
                return result.json();
            });
    }

    /**
     * Delete an object using DELETE
     * @param url
     * @param search
     * @param headers
     * @returns {Observable<any>} object from api
     */
    public destroy(url:string, search:any = {}, headers:any = {}):Observable<any> {
        let options = this.getRequestOptions(headers, search);
        return this._http
            .delete(url, options)
            .map((result) => {
                return result.json();
            });
    }

    /**
     * Makes any custom action.
     * @param url
     */
    public action(url:string):Observable<any> {
        throw new Error("Not implemented");
    }
}
