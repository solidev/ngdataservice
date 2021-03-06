import {DSModel, DSRestCollection, DSRestCollectionSetup} from "ngdataservice";
import {Injectable} from "@angular/core";

export class Train extends DSModel {
    public id: number;
    public name: string;

    public honk(): void {
        console.log(`${this.name} is honking`);
    }
}

@Injectable()
export class TrainCollection extends DSRestCollection<Train> {
    public adapter_config: any = {basePath: "/posts"};
    public model = Train;

    constructor(public setup: DSRestCollectionSetup) {
        super(setup);
    }

}