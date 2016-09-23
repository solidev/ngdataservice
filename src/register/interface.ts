import {IDSCollection} from "../collection/interface";
export interface IDSRegister {
    register(name: string, collection: IDSCollection<any>): IDSCollection<any>;
    get(name: string): IDSCollection<any>;
}
