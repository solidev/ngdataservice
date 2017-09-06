import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {cloneDeep} from "lodash";
import {IDSModel} from "./interface";
import {IDSCollection} from "../collection/interface";

/**
 * Provides a stream of linked object.
 * @param obj parent object
 * @param service service used for retrieval
 * @param name linked object id property name in parent object
 * @param options refresh: true
 * @param context data : used for sub resources
 * @returns {any} observable of linked object
 */
export function getLinked<T>(obj: IDSModel, service: string, name: string, options: any = {}, ctx: any = {}): Observable<T> {
    if (!obj[name]) {
        return Observable.of(null);
    }
    if (!obj["_" + name]) {
        obj["_" + name] = new ReplaySubject<T>(1);
        options.refresh = true;
    }
    if (options.refresh) {
        (<any>obj)._collection[service].get(obj[name], {context: ctx}).subscribe((dt) => {
            obj["_" + name].next(dt);
        });
    }
    return obj["_" + name].asObservable();
}

/**
 * Provides a stream of linked objects.
 * @param obj parent object
 * @param service service used for retrieval (property of obj._collection)
 * @param name property name used for subject storage
 * @param options options refresh: true
 * @param filter additional filter
 * @returns {Observable<T[]>} observable of linked objects array
 */
export function getLinkedMany<T extends IDSModel>(obj: IDSModel,
                                                  service: string,
                                                  name: string,
                                                  options: any = {},
                                                  filter: any = {},
                                                  ctx: any = {}
): Observable<T[]> {
    if (!obj["_" + name]) {
        obj["_" + name] = new ReplaySubject<T[]>(1);
        options.refresh = true;
    }
    if (options.refresh) {
        let qry: any = cloneDeep(filter);
        qry[name] = obj._pk;
        let coll: IDSCollection<T>;
        if (service === "self") {
            coll = (<any>obj)._collection;
        } else {
            coll = (<any>obj)._collection[service];
        }
        coll.queryset.query(qry).get(ctx)
            .subscribe((dt) => {
                obj["_" + name].next(dt.items);
            });
    }
    return obj["_" + name].asObservable();
}
