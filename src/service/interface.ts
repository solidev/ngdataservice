import {IDSCollection} from "../collection/interface";
export interface IDSDataService<T> {
    collection(params: any): IDSCollection<T>;
}