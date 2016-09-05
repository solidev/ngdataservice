import {
    IDSAdapter, IDSAdapterIdentifierParams, IDSAdapterProvider, IDSAdapterFilterParams,
    IDSAdapterSorterParams
} from "./interface";
import {IDSRestIdentifier} from "../backends/rest";
import {IDSModel} from "../model/interface";
import {Injectable, OpaqueToken, Inject} from "@angular/core";
import {isNumber, isString} from "lodash";
import {DSModel} from "../model/model";

export let REST_ADAPTER_CONFIG = new OpaqueToken("adapter.resturl.config");

export interface IDSFlatRestAdapterConfig {
    basePath: string;
}


const DEFAULT_IDENTIFIER_PARAMS = {local: false, create: false};

@Injectable()
export class DSFlatRestUrlAdapter implements IDSAdapter {

    constructor(@Inject(REST_ADAPTER_CONFIG) protected _config: IDSFlatRestAdapterConfig) {
    }

    public identifier(instance: IDSModel | number | string = null,
                      params: IDSAdapterIdentifierParams = DEFAULT_IDENTIFIER_PARAMS): IDSRestIdentifier {
        let id: any = null;
        if (params.local) {
            // returns local path
            return {
                path: "?__local__" + this._config.basePath + "/" + (<DSModel>instance)._local,
                headers: {},
                query: {}
            };
        } else if (params.create) {
            // returns creation path
            return {
                path: this._config.basePath,
                headers: {},
                query: {}
            };
        }
        if (instance === null) {
            return null;
        }
        if (isNumber(instance)) {
            id = instance.toString();
        } else if (isString(instance)) {
            id = instance;
        } else if ((<DSModel>instance)._pk) {
            id = (<DSModel>instance)._pk;
        }
        if (id === null) {
            return null;
        }
        return {
            path: this._config.basePath + "/" + id,
            headers: {},
            query: {}
        };
    }

    public search(filter: IDSAdapterFilterParams = {}, sorter: IDSAdapterSorterParams = {}): any {
        let query = _.cloneDeep(filter);
        query = _.extend(query, sorter);
        return {path: this._config.basePath, query: query, headers: {}};
    }
}


@Injectable()
export class DSFlatRestUrlAdapterProvider implements IDSAdapterProvider {
    public provide(params: IDSFlatRestAdapterConfig): IDSAdapter {
        return new DSFlatRestUrlAdapter(params);
    }
}
