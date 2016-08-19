import {IDSAdapter, IDSAdapterIdentifierParams} from "./interface";
import {IDSRestIdentifier} from "../backends/rest";
import {IDSModel} from "../model/interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSRestUrlAdapter implements IDSAdapter {

    public identifier(instance: IDSModel, params: IDSAdapterIdentifierParams = {}): IDSRestIdentifier {
        return {
            url: "http://todo",
            headers: {},
            query: {}
        };
    }

    public search(params: any): any {
        return {
            url: "http://todo",
            headers: {},
            query: {}
        };
    }
}
