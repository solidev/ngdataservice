export interface IDataPersistence {
    save(identifier: any, data: any): any;
    retrieve(identifier: any): any;
    destroy(identifier: any): any;
    list(params: any): any;
    clear(params: any): any;
}
