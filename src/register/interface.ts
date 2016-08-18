import {IDataCollection} from "../collection/interface";
export interface IDataRegister {
    register(name: string, collection: IDataCollection): boolean;
    get(name: string): IDataCollection;
}
