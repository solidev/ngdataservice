import {Observer} from "rxjs";
import {IDSFilter, IDSFilterField, IDSFilterFunction, IDSFilterProvider} from "./interface";
import {Injectable, OpaqueToken, Inject} from "@angular/core";


export interface IDSBasicFilterConfig {
    common?: {[index: string]: IDSFilterField};
}


export let BASIC_FILTER_CONFIG = new OpaqueToken("filter.basic.config");

@Injectable()
export class DSBasicFilter implements IDSFilter {
    public listener: Observer<any>;
    public fields: {[index: string]: IDSFilterField};
    private _common: {[index: string]: IDSFilterField} = {};

    constructor(@Inject(BASIC_FILTER_CONFIG) params: IDSBasicFilterConfig = {}) {
        if (params) {
            this._common = (<any>params.common) || {};
        }
    }

    public get backendFilter(): any {
        let fields = _.clone(this.fields);
        _.extend(fields, this._common);
        return fields;
    }

    public localFilter: IDSFilterFunction = (item: any) => {
        console.log("NOT IMPLEMENTED");
        return true;
    };

    public update(filter_params: any): void {
        this.fields = filter_params;
    }

}

@Injectable()
export class DSBasicFilterProvider implements IDSFilterProvider {
    public provide(params: any): IDSFilter {
        return new DSBasicFilter();
    }
}
