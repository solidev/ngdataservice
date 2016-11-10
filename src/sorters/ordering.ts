import {Observer} from "rxjs/Observer";
import {IDSSorter, IDSSorterField, IDSSorterFunction, IDSSorterProvider} from "./interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSOrderingSorter implements IDSSorter {
    public listener: Observer<any>;
    public fields: IDSSorterField[] = [];

    public localSorter: IDSSorterFunction = (item1: any, item2: any) => {
        if (item1._pk > item2._pk) {
            return 1;
        }
        if (item1._pk < item2._pk) {
            return -1;
        }
        return 0;
    };

    public update(sorter_params: any): void {
        this.fields = []
        for (let sortfield of sorter_params) {
            this.fields.push(sortfield)
        }
    }

    public get backendSorter() {
        return {ordering: this.fields.join(",")}
    }

}

@Injectable()
export class DSOrderingSorterProvider implements IDSSorterProvider {
    public provide(): IDSSorter {
        return new DSOrderingSorter();
    }
}
