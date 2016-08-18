import {Injectable} from "@angular/core";
import {Datastore} from "../collection/datacollection.orig";
import {Dataobject} from "../dataobject/dataobject";

/**
 * Datastore registry.
 * Provides reference to datastores instances.
 */
@Injectable()
export class DatastoresService {
  private _datastores:{[index:string]:Datastore<any>} = {};

  public register<T extends Dataobject>(name:string, ds:Datastore<T>):Datastore<T> {
    this._datastores[name] = ds;
    return this._datastores[name];
  }

  public get<T extends Dataobject>(name:string):Datastore<T> {
    return this._datastores[name];
  }
}
