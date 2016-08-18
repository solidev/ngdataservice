import {IDSDataService} from "../service/interface";
export interface IDSRegister {
    register(name: string, collection: IDSDataService): IDSDataService;
    get(name: string): IDSDataService;
}
