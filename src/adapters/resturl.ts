import {IDSAdapter, IDSAdapterIdentifierParams} from "./interface";
import {IDSRestIdentifier} from "../backends/rest";
import {IDSModel} from "../model/interface";
import {Injectable, OpaqueToken, Inject} from "@angular/core";

export let REST_ADAPTER_CONFIG = new OpaqueToken("adapter.resturl.config");

export interface IDSRestAdapterConfig {
    basePath: string;
}

@Injectable()
export class DSRestUrlAdapter implements IDSAdapter {

    constructor(@Inject(REST_ADAPTER_CONFIG) protected _config: IDSRestAdapterConfig) {
    }

    public identifier(instance: IDSModel, params: IDSAdapterIdentifierParams = {}): IDSRestIdentifier {
        return {
            url: "http://todo",
            headers: {},
            query: {}
        };
    }

    public search(params: any): any {
        return {
            url: "http://todo",
            headers: {},
            query: {}
        };
    }
}
