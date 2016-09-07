import {IDSDataService} from "../service/interface";
export interface IDSRegister {
    register(name: string, collection: IDSDataService<any>): IDSDataService<any>;
    get(name: string): IDSDataService<any>;
}
