import {IDSAdapter, IDSAdapterIdentifierParams, IDSAdapterProvider, IDSAdapterSearchParams} from "./interface";
import {IDSRestIdentifier} from "../backends/rest";
import {IDSModel} from "../model/interface";
import {Injectable, OpaqueToken, Inject} from "@angular/core";
import {isNumber, isString, template, extend} from "lodash";
import {DSModel} from "../model/model";

/**
 * Rest adapter configurator.
 */
export let REST_ADAPTER_CONFIG = new OpaqueToken("adapter.resturl.config");

export interface IDSRestUrlAdapterConfig {
    basePath: string;
    replace?: string[];
}


const DEFAULT_IDENTIFIER_PARAMS = {local: false, create: false};

@Injectable()
export class DSRestUrlAdapter implements IDSAdapter {

    constructor(@Inject(REST_ADAPTER_CONFIG) protected _config: IDSRestUrlAdapterConfig) {
    }

    /**
     * Return instance identifier.
     * @param instance
     * @param params
     * @returns {any}
     */
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
                path: this.path_replace(this._config.basePath, instance, params.context),
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
            // SEE: use id placeholder in path or direct id add depending on option ?
            path: this.path_replace(this._config.basePath, instance, params.context) + "/" + id,
            headers: {},
            query: {}
        };
    }

    /**
     * Return search url
     * @param params
     * @returns {{path: string, query: IDSAdapterFilterParams, headers: {}}}
     */
    public search(params: IDSAdapterSearchParams = {}): any {
        let query = _.cloneDeep(params.filter);
        query = _.extend(query, params.sorter);
        return {
            path: this.path_replace(this._config.basePath, null, params.context),
            query: query,
            headers: {}
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
export class DSFlatRestUrlAdapterProvider implements IDSAdapterProvider {
    public provide(params: IDSRestUrlAdapterConfig): IDSAdapter {
        return new DSRestUrlAdapter(params);
    }
}
