import {IDSDataService} from "./interface";
import {IDSBackend} from "../backends/interface";
import {IDSAdapter} from "../adapters/interface";
import {IDSPersistence} from "../persistence/interface";
import {IDSRegister} from "../register/interface";
import {Injectable} from "@angular/core";
import {IDSCollection} from "../collection/interface";

class DSGenericDataService implements IDSDataService {
    constructor(
        public backend: IDSBackend,
        public serializer: IDSAdapter,
        public adapter: IDSAdapter,
        public persistence: IDSPersistence,
        public registry: IDSRegister,
    ) {}

    private _defaultCollection: IDSCollection;

    public collection(params: any): IDSCollection {
        return this._defaultCollection;
    }
}


