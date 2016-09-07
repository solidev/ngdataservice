import {IDSCollection} from "../collection/interface";
import {IDSModel} from "../model/interface";
export interface IDSDataService<T extends IDSModel> {
    collection(params: any): IDSCollection<T>;
}