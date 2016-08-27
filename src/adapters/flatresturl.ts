import {IDSAdapter, IDSAdapterIdentifierParams, IDSAdapterProvider} from "./interface";
import {IDSRestIdentifier} from "../backends/rest";
import {IDSModel} from "../model/interface";
import {Injectable, OpaqueToken, Inject} from "@angular/core";

export let REST_ADAPTER_CONFIG = new OpaqueToken("adapter.resturl.config");

export interface IDSRestAdapterConfig {
    basePath: string;
}

@Injectable()
export class DSFlatRestUrlAdapter implements IDSAdapter {

    constructor(@Inject(REST_ADAPTER_CONFIG) protected _config: IDSRestAdapterConfig) {
    }

    public identifier(instance: IDSModel = null, params: IDSAdapterIdentifierParams = {}): IDSRestIdentifier {
        if (params.create ||
            instance === null ||
            (instance.id === undefined && instance.pk === undefined)
        ) {
            return {path: this._config.basePath, headers: {}, query: {}};
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
