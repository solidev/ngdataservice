

import {Injectable} from "@angular/core";
import {DatastoresService} from "./store";
import {Dataobject} from "./component";
import {Http} from "@angular/http";
import * as _ from "lodash";
import "rxjs/add/operator/skip";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {UrlBuilder} from "./apipath";
import {LocalStore} from "./persistence/memory";
import {DataRequest} from "./backends/rest";
import {IAuthService} from "./auth";


/**
 * Datastore creation params.
 * baseUrl is an url template with placeholders between brackets :
 * `http://myapidomain.com/api/{version}/context/{ctxId}/object/{id}/?q={query}`
 * - if trailingSlash is false (default), trailing slashes are removed
 */
export interface IDatastoreParams {
    baseUrl?:string;
    objectUrl?:string;
    listUrl?:string;
    name?:string;
    trailingSlash?:boolean;
    maxAge?:number;
    maxItems?:number;
    storeQueries?:boolean;
    storeCustom?:boolean;
    authenticated?:boolean;
    ignore?:{
        search?:string[];
        path?:string[];
    };
}


@Injectable()
export class Datastore<T extends Dataobject> {
    private _store:LocalStore<T>;
    private _req:DataRequest;
    private _url:UrlBuilder;

    constructor(protected _params:IDatastoreParams,
                protected _base:{ new (values?:any, _ds?:Datastore<T>):T },
                private _dss:DatastoresService,
                private _http:Http,
                private _auth:IAuthService) {
        this._params = <IDatastoreParams>_.defaults(_params, {
            objectUrl: "",
            listUrl: "",
            name: _params.baseUrl || _params.listUrl || _params.objectUrl,
            trailingSlash: false,
            maxAge: 3600 * 24 * 30,
            maxItems: 1000000,
            storeQueries: false,
            storeCustom: false,
            authenticated: true,
            ignore: {
                search: [],
                path: []
            }
        });
        this._dss.register(this._params.name, this);
        this._store = new LocalStore<T>(this._params);
        this._url = new UrlBuilder(this._params);
        this._req = new DataRequest(_auth, _http, this._params);
    }


    public create(values:any = {}):T {
        let em = new this._base(this);
        Object.assign(em, values);
        return em;
    }

    /**
     * Get an object.
     * @param identifier : object identifier
     * @param search : search params
     * @param options : operation options (force refresh, force details...)
     * @returns {any} : replaysubject for object
     */
    public get(identifier:any, search:any = {}, options:any = {}):ReplaySubject<T> {
        let ocurl = this._url.ocurl(identifier, search);
        let ourl = this._url.ourl(identifier, search);
        let [obj, sub] = this._store.retrieve(ocurl);
        console.log("Get: found obj, sub for ", obj, sub, ocurl, ourl)
        if (obj) {
            if (options.refresh) {
                console.log("Refreshing");
                this._req.retrieveOne(ourl).subscribe((result) => {
                    this._store.update(ocurl, new this._base(result, this));
                });
            } else {
                console.log("Re-emitting object");
                sub.next(obj);
                return sub;
            }
        } else {
            console.log("Creating");
            sub = this._store.create(ocurl);
            this._req.retrieveOne(ourl).subscribe((result) => {
                console.log("Got result for creation");
                this._store.update(ocurl, new this._base(result, this));
            });
            return sub;
        }
    }

    /**
     * Get a list of objects.
     * @param identifier : list identifier
     * @param search : search parameters
     * @param options : search options
     * @returns {any} : observable of {search parameters, array of replaysubject for objects}
     */
    public getList(identifier:any = {}, search:any = {}, options:any = {}):any {
        let lurl = this._url.lurl(identifier, search);
        return this._req.retrieveList(lurl).map((result) => {
            let res:any = [];
            for (let item of result.data) {
                let r = new this._base(item, this);
                let ocurl = this._url.ocurl(identifier, search, r);
                console.log("Received result", r);
                res.push(this._store.update(ocurl, r));
            }
            return {_meta: result._meta, data: res};
        });
    }

    public remove(obj:T):Observable<boolean> {
        throw new Error("Not implemented");
    }

    public save(obj:T):Observable<boolean> {
        throw new Error("Not implemented");
    }

    public update(obj:T):Observable<boolean> {
        throw new Error("Not implemented");
    }

    public refresh(obj:T):Observable<boolean> {
        throw new Error("Not implemented");
    }

    public custom(method:string, path:string, obj:T, data:any):Observable<any> {
        throw new Error("Not implemented");
    }

    public empty():Observable<boolean> {
        throw new Error("Not implemented");
    }

}
