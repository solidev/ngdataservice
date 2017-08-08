import { DSModel, DSRestCollection, DSRestCollectionSetup, IDSResponseParser } from "ngdataservice";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";

export class CustomJsonDataParser implements IDSResponseParser {
    public parse(response: Response, params: any): any {
        let rdat = (<any>response.json());
        if (rdat && rdat.data) {
            return rdat.data;
        }
        return rdat;
    }
}

export class Train extends DSModel {
    public id: number;
    public title: string;

    public honk(): void {
        console.log(`${this.title} is honking`);
    }
}

@Injectable()
export class TrainCollection extends DSRestCollection<Train> {
    public adapter_config: any = {basePath: "/posts"};
    public backend_parser_class = CustomJsonDataParser;
    public model = Train;

    constructor(public setup: DSRestCollectionSetup) {
        super(setup);
    }

}

