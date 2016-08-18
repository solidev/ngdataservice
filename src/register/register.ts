import {Injectable} from "@angular/core";
import {IDSRegister} from "./interface";
import {IDSDataService} from "../service/interface";
import {DSModel} from "../model/model";


/**
 * Dataservices registry.
 * Provides reference to data services to avoid injection loops.
 */
@Injectable()
export class DSDataRegister extends IDSRegister {
    private _datastores: {[index: string]: IDSDataService<any>} = {};

    public register<T extends DSModel>(name: string, ds: IDSDataService<T>): IDSDataService<T> {
        this._datastores[name] = ds;
        return this._datastores[name];
    }

    public get<T extends DSModel>(name: string): IDSDataService<T> {
        return this._datastores[name];
    }
}
