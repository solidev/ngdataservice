import {IDSCollection, IDSCollectionSetup} from "../collection/interface";
import {IDSModel} from "../model/interface";
export interface IDSDataService<T extends IDSModel> {
    getCollection(params?: any): IDSCollection<T>;
    getSetup(): IDSCollectionSetup;
}
