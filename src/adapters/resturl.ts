import { IDSAdapter, IDSAdapterDetailParams, IDSAdapterListParams, IDSAdapterProvider } from "./interface";
import { IDSRestIdentifier } from "../backends/rest";
import { IDSModel } from "../model/interface";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { cloneDeep, extend, isNumber, isString, template } from "lodash";
import { DSModel } from "../model/model";

export interface IDSRestUrlAdapterConfig {
    basePath?: string;
    replace?: string[];
    itemPath?: string;
    createPath?: string;
    listPath?: string;
}

/**
 * Rest adapter configurator.
 */
export let REST_ADAPTER_CONFIG = new InjectionToken<IDSRestUrlAdapterConfig>("adapter.resturl.config");


const DEFAULT_IDENTIFIER_PARAMS = {local: false, create: false};

@Injectable()
export class DSRestUrlAdapter implements IDSAdapter {

    constructor(@Inject(REST_ADAPTER_CONFIG) protected _config: IDSRestUrlAdapterConfig) {
    }

    /**
     * Return instance detail.
     * @param instance
     * @param params
     * @returns {any}
     */
    public detail(instance: IDSModel | number | string = null,
                  params: IDSAdapterDetailParams = DEFAULT_IDENTIFIER_PARAMS): IDSRestIdentifier {
        let id: any = null;
        let headers: any = {};
        let query: any = {};
        if (params.options) {
            if (params.options.headers) {
                headers = params.options.headers;
            }
            if (params.options.query) {
                query = params.options.query;
            }
        }
        if (params.local) {
            // returns local path
            return {
                path: "?__local__" + this._config.basePath + "/" + (<DSModel>instance)._local,
                headers: headers,
                query: query
            };
        } else if (params.create) {
            // returns creation path
            return {
                path: this.path_replace(this._config.basePath, instance, params.context),
                headers: headers,
                query: query
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
        if (this._config.itemPath) {
            let out = {
                path: this.path_replace(this._config.itemPath, instance, params.context),
                headers: headers,
                query: query
            };
            return out;
        }
        return {
            path: this.path_replace(this._config.basePath, instance, params.context) + "/" + id,
            headers: headers,
            query: query
        };
    }

    /**
     * Return search url
     * @param params
     * @returns {{path: string, query: IDSAdapterFilterParams, headers: {}}}
     */
    public list(params: IDSAdapterListParams = {}): any {
        let query = cloneDeep(params.filter);
        query = extend(query, params.sorter || {});
        query = extend(query, params.paginator || {});
        let headers: any = {};
        if (params.options) {
            query = extend(query, params.options.query || {});
            headers = extend(headers, params.options.headers || {});
        }
        return {
            path: this.path_replace(this._config.basePath, null, params.context),
            query: query,
            headers: headers
        };
    }

    /**
     * Provides path replacement for url, using instance and context
     * TODO: use dotted path for context/instance data (? templating engine ?)
     * @param path
     * @param instance
     * @param context
     * @returns {string}
     */
    public path_replace(path: string, instance: any, context: any = {}): string {
        let options = extend({}, {instance: instance}, context);
        path = template(path)(options);
        return path;
    }

}


@Injectable()
export class DSRestUrlAdapterProvider implements IDSAdapterProvider {
    public provide(params: IDSRestUrlAdapterConfig): IDSAdapter {
        return new DSRestUrlAdapter(params);
    }
}
