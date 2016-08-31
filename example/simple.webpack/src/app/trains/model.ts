import {DSModel, DSService, DSRestCollection, DSRestCollectionSetup} from "ng2datastore";
import {Injectable} from "@angular/core";

export class Train extends DSModel {
    /* @Field({
     type: DSIntegerField,
     validators: [DSGreaterThanValidator(0)]
     })*/
    public id: number = 12;
    /*@Field({
     type: DSStringField,
     validators: [DSMinLength(5), DSMaxLength(20)]
     })*/
    public name: string = "chugginton";

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

@Injectable()
export class TrainService extends DSService<Train> {
    public adapter_config: any = {basePath: "/posts"};
    public model = Train;

    constructor(public setup: DSRestCollectionSetup) {
        super();
    }
}
