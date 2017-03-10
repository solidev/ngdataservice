import {Injectable} from "@angular/core";
import {IDSPersistence, IDSPersistenceProvider} from "./interface";
import {map, isFunction, uniqueId, filter} from "lodash";
import {IDSFilterFunction} from "../filters/interface";
import {IDSSorterFunction} from "../sorters/interface";

// FIXME: localstorage root key should be "settable" or "unique"

@Injectable()
export class DSLocalstoragePersistence implements IDSPersistence {
    public type: string = "JSON";
    protected storage: any;
    protected _name: string = uniqueId("persist");
    private _items: {[index: string]: any} = {};

    constructor() {
        this.storage = localStorage;
    }

    public save(identifier: any, data: any): any {
        let id: string = JSON.stringify(identifier);
        this._getItems();
        this._items[id] = JSON.stringify(data);
        this._saveItems();
        return JSON.parse(JSON.stringify(data));
    }

    public retrieve(identifier: any): any {
        let id: string = JSON.stringify(identifier);
        this._getItems();
        if (this._items[id] !== undefined) {
            return JSON.parse(this._items[id]);
        } else {
            return undefined;
        }
    }

    public destroy(identifier: any): void {
        let id: string = JSON.stringify(identifier);
        this._getItems();
        delete this._items[id];
        this._saveItems();
    }

    public list(lfilter: IDSFilterFunction = null, sorter: IDSSorterFunction = null): any {
        this._getItems();
        let items = map(this._items, (value, key) => {
            return JSON.parse(value);
        });
        if (isFunction(lfilter)) {
            items = filter(items, lfilter);
        }
        if (isFunction(sorter)) {
            items.sort(sorter);
        }
        return items;
    }

    public clear(params: any = {}): any {
        this._items = {};
        this._saveItems();
    }

    private _getItems(): any {
        let res = this.storage.getItem(this._name);
        if (res !== null) {
            return this._items = JSON.parse(res);
        } else {
            return this._items = {};
        }
    }

    private _saveItems(): void {
        this.storage.setItem(this._name, JSON.stringify(this._items));
    }
}

@Injectable()
export class DSLocalstoragePersistenceProvider implements IDSPersistenceProvider {
    public provide(params: any): DSLocalstoragePersistence {
        return new DSLocalstoragePersistence();
    }
}
