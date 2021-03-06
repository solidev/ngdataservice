import {Observer} from "rxjs/Observer";
import {IDSFilter, IDSFilterField, IDSFilterFunction, IDSFilterProvider, IDSFilterUpdateParams} from "./interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSDummyFilter implements IDSFilter {
    public listener: Observer<any>;
    public fields: {[index: string]: IDSFilterField};
    public backendFilter: any = {};

    constructor() {

    }

    public localFilter: IDSFilterFunction = (item: any) => {
        return true;
    };

    public update(filter_params: any, params: IDSFilterUpdateParams = {}): void {
        console.warn("Dummy filter in action, do nothing");
    }

}

@Injectable()
export class DSDummyFilterProvider implements IDSFilterProvider {
    public provide(params: any): IDSFilter {
        return new DSDummyFilter();
    }
}
