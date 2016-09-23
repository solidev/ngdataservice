import {Injectable} from "@angular/core";
import {IDSRegister} from "./interface";
import {DSModel} from "../model/model";
import {IDSCollection} from "../collection/interface";


/**
 * Dataservices registry.
 * Provides reference to data services to avoid injection loops.
 */
@Injectable()
export class DSRegister implements IDSRegister {
    private _datastores: {[index: string]: IDSCollection<any>} = {};

    public register<T extends DSModel>(name: string, ds: IDSCollection<T>): IDSCollection<T> {
        this._datastores[name] = ds;
        return this._datastores[name];
    }

    public get<T extends DSModel>(name: string): IDSCollection<T> {
        return this._datastores[name];
    }
}
