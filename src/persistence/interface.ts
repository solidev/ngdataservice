export interface IDSPersistence {
    type: string;
    save(identifier: any, data: any): any;
    retrieve(identifier: any): any;
    destroy(identifier: any): void;
    list(params: any): any;
    clear(params: any): any;
}

export interface IDSPersistenceProvider {
    provide(params: any): IDSPersistence;
}
