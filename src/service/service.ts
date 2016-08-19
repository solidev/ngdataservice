import {IDSDataService} from "./interface";
import {IDSBackend} from "../backends/interface";
import {IDSAdapter} from "../adapters/interface";
import {IDSPersistence} from "../persistence/interface";
import {IDSRegister} from "../register/interface";
import {Injectable} from "@angular/core";
import {IDSCollection} from "../collection/interface";
import {IDSModel} from "../model/interface";
import {DSRestBackend} from "../backends/rest";
import {DSDefaultSerializer} from "../serializers/default";
import {DSRestUrlAdapter} from "../adapters/resturl";
import {DSMemoryPersistence} from "../persistence/memory";
import {DSRegister} from "../register/register";
import {IDSSerializer} from "../serializers/interface";

export class DSGenericDataService<T extends IDSModel> implements IDSDataService<T> {
    constructor(
        public backend: IDSBackend,
        public serializer: IDSSerializer,
        public adapter: IDSAdapter,
        public persistence: IDSPersistence,
        public registry: IDSRegister,
    ) {}

    public name: string = "toto";
    private _defaultCollection: IDSCollection<T>;

    public collection(params: any): IDSCollection<T> {
        return this._defaultCollection;
    }
}

@Injectable()
export class DSRestDataService<T extends IDSModel> extends DSGenericDataService<T> {
    constructor(
        public backend: DSRestBackend,
        public serializer: DSDefaultSerializer,
        public adapter: DSRestUrlAdapter,
        public persistence: DSMemoryPersistence,
        public registry: DSRegister
    ) {
        super(backend, serializer, adapter, persistence, registry);
    }
}