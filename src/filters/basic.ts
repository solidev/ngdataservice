import {Observer} from "rxjs/Observer";
import {IDSFilter, IDSFilterField, IDSFilterFunction, IDSFilterProvider, IDSFilterUpdateParams} from "./interface";
import {Inject, Injectable, InjectionToken, Optional} from "@angular/core";
import {assign, clone, extend} from "lodash";

export interface IDSBasicFilterConfig {
    common?: { [index: string]: IDSFilterField };
}

// FIXME: AOT: wait for https://github.com/angular/angular/issues/12631
export class DSBasicFilterConfig {
    public common: { [index: string]: IDSFilterField };
}

export let BASIC_FILTER_CONFIG = new InjectionToken<IDSBasicFilterConfig>("filter.basic.config");

@Injectable()
export class DSBasicFilter implements IDSFilter {
    public listener: Observer<any>;
    public fields: { [index: string]: IDSFilterField } = {};
    private _common: { [index: string]: IDSFilterField } = {};

    constructor(@Optional() @Inject(BASIC_FILTER_CONFIG) params: DSBasicFilterConfig) {
        if (params) {
            this._common = (<any>params.common) || {};
        } else {
            this._common = {};
        }
    }

    public get backendFilter(): any {
        let fields = clone(this.fields);
        extend(fields, this._common);
        return fields;
    }

    public localFilter: IDSFilterFunction = (item: any) => {
        console.error("NOT IMPLEMENTED");
        return true;
    };

    public update(filter_params: any, params: IDSFilterUpdateParams = {}): void {
        if (params.partial) {
            assign(this.fields, filter_params);
        } else {
            this.fields = filter_params;
        }
    }

}

@Injectable()
export class DSBasicFilterProvider implements IDSFilterProvider {
    public provide(params: any): IDSFilter {
        return new DSBasicFilter(params);
    }
}
