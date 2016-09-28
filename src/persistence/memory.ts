import {Injectable} from "@angular/core";
import {IDSPersistence, IDSPersistenceProvider} from "./interface";
import * as values from "lodash/values";
import * as isFunction from "lodash/isFunction";
import * as _filter from "lodash/filter";
import {IDSFilterFunction} from "../filters/interface";
import {IDSSorterFunction} from "../sorters/interface";

@Injectable()
export class DSMemoryPersistence implements IDSPersistence {
    public type: string = "OBJ";
    private _items: {[index: string]: any} = {};

    public save(identifier: any, data: any): any {
        let id: string = JSON.stringify(identifier);
        this._items[id] = data;
        return this._items[id];
    }

    public retrieve(identifier: any): any {
        let id: string = JSON.stringify(identifier);
        return this._items[id];
    }

    public destroy(identifier: any): void {
        let id: string = JSON.stringify(identifier);
        delete this._items[id];
    }

    public list(filter: IDSFilterFunction = null, sorter: IDSSorterFunction = null): any {
        let items;
        if (isFunction(filter)) {
            items = _filter(values(this._items));
        }
        items = values(this._items);
        if (isFunction(sorter)) {
            items.sort(sorter);
        }
        return items;
    }

    public clear(params: any = {}): any {
        this._items = {};
    }
}

@Injectable()
export class DSMemoryPersistenceProvider implements IDSPersistenceProvider {
    public provide(params: any): DSMemoryPersistence {
        return new DSMemoryPersistence();
    }
}
