import {Observer} from "rxjs";
import {IDSSorter, IDSSorterField, IDSSorterFunction, IDSSorterProvider} from "./interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSDummySorter implements IDSSorter {
    public listener: Observer<any>;
    public fields: IDSSorterField[] = [];

    public backendSorter: any = {};
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
        console.log("Dummy sorter in action, do nothing");
    }

}

@Injectable()
export class DSDummySorterProvider implements IDSSorterProvider {
    public provide(): IDSSorter {
        return new DSDummySorter();
    }
}
