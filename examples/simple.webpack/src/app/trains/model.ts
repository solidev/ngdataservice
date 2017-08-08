import {DSModel, DSRestCollection, DSRestCollectionSetup} from "ngdataservice";
import {Injectable} from "@angular/core";

export class Train extends DSModel {
    /* @Field({
     type: DSIntegerField,
     validators: [DSGreaterThanValidator(0)]
     })*/
    public id: number;
    /*@Field({
     type: DSStringField,
     validators: [DSMinLength(5), DSMaxLength(20)]
     })*/
    public title: string;

    public honk(): void {
        console.log(`${this.title} is honking`);
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

