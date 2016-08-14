import {ReplaySubject} from "rxjs/Rx";
import {IDatastoreParams} from "../collection";


export interface IMetaStorage {
    accessed:number;
    updated:number;
    details?:boolean;
    pending?:boolean;
}

export class LocalStore<T> {
    private _objects:{[index:string]:T} = {};
    private _meta:{[index:string]:IMetaStorage} = {};
    private _subjects:{[index:string]:ReplaySubject<T>} = {};

    constructor(private _params:IDatastoreParams) {
    }

    public create(url:string):ReplaySubject<T> {
        this._objects[url] = null;
        if (!this._meta[url]) {
            this._meta[url] = {pending: true, accessed: null, updated: null};
        }
        if (!this._subjects[url]) {
            this._subjects[url] = new ReplaySubject<T>(1);
        }
        return this._subjects[url];
    }

    public update(url:string, obj:T):ReplaySubject<T> {
        console.log("Updating ", url, "with", obj);
        let o:any = this._objects[url];
        if (!o) {
            this.create(url);
            this._objects[url] = obj;
            o = this._objects[url];
        } else {
            o.assign(obj);
        }
        let m = this._meta[url];
        if (o.populate) {
            o.populate();
        }
        m.accessed = Date.now();
        m.updated = Date.now();
        m.pending = false;
        this._subjects[url].next(o);
        return this._subjects[url];
    }

    public retrieve(url:string):[T, ReplaySubject<T>] {
        let m = this._meta[url];
        if (!m) {
            return [null, null];
        }
        m.accessed = Date.now();
        return [this._objects[url], this._subjects[url]];
    }

    public cleanup(maxTime:number = 600):string[] {
        console.log("Not implemented");
        return [];
    }

    public meta(url:string):IMetaStorage {
        return this._meta[url];
    }
}
