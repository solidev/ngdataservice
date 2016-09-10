import {Observer} from "rxjs";
import {IDSFilter, IDSFilterField, IDSFilterFunction, IDSFilterProvider} from "./interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSBasicFilter implements IDSFilter {
    public listener: Observer<any>;
    public fields: {[index: string]: IDSFilterField};

    constructor() {

    }

    public get backendFilter(): any  {
        return this.fields;
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
