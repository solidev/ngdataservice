export interface IDSPaginator {
    getPaginationInfos(result: any, params?: any): any;
    getResults(result: any, params?: any): any;
    update(params: any): void;
    backendPaginate: any;
    localPaginate: any;
}

export interface IDSPaginatorClass {
    new(params: any): IDSPaginator;
}

export interface IDSPaginatorProvider {
    provide(params: any): IDSPaginator;
}
