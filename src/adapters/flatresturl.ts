import {IDSAdapter, IDSAdapterIdentifierParams, IDSAdapterProvider} from "./interface";
import {IDSRestIdentifier} from "../backends/rest";
import {IDSModel} from "../model/interface";
import {Injectable, OpaqueToken, Inject} from "@angular/core";

export let REST_ADAPTER_CONFIG = new OpaqueToken("adapter.resturl.config");

export interface IDSRestAdapterConfig {
    basePath: string;
}
function getRandomId(): string {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

@Injectable()
export class DSFlatRestUrlAdapter implements IDSAdapter {

    constructor(@Inject(REST_ADAPTER_CONFIG) protected _config: IDSRestAdapterConfig) {
    }

    public identifier(instance: IDSModel = null, params: IDSAdapterIdentifierParams = {}): IDSRestIdentifier {
        if (params.unsaved) {
            let randomId = getRandomId();
            let path = "?__local__" + this._config.basePath + "/" + randomId;
            // FIXME: add setter for localId ?
            (<any>instance)._localId = path;
            return {path: "?__local__" + this._config.basePath + "/" + randomId, headers: {}, query: {}};
        }
        else if (params.create) {
            return {path: this._config.basePath, headers: {}, query: {}};

        } else if (instance === null ||
            (instance.id === undefined && instance.pk === undefined)
        ) {
            return null;
        } else if (instance.id !== undefined || instance.pk !== undefined) {
            let id = instance.id || instance.pk;
            return {path: this._config.basePath + "/" + id, headers: {}, query: {}};
        } else {
            return {path: this._config.basePath, headers: {}, query: {}};
        }

    }

    public search(params: any = {}): any {
        if (params && params.search) {
            return {path: this._config.basePath, query: params.search, headers: {}};
        } else {
            return {path: this._config.basePath, headers: {}, query: {}};
        }
    }
}


@Injectable()
export class DSFlatRestUrlAdapterProvider implements IDSAdapterProvider {
    public provide(params: IDSRestAdapterConfig): IDSAdapter {
        return new DSFlatRestUrlAdapter(params);
    }
}
