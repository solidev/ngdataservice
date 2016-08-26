import {Injectable} from "@angular/core";
import {IDSPersistence, IDSPersistenceProvider} from "./interface";
@Injectable()
export class DSMemoryPersistence implements IDSPersistence {
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
    public list(params: any): any {
        return this._items;
    }
    public clear(params: any): any {
        this._items = {};
    }
}

@Injectable()
export class DSMemoryPersistenceProvider implements IDSPersistenceProvider {
    public provide(params: any): DSMemoryPersistence {
        return new DSMemoryPersistence();
    }
}