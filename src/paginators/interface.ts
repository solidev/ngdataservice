export interface IDSPaginator {
    getPaginationInfos(result: any): any;
    getResults(result: any): any;
}

export interface IDSPaginatorClass {
    new(params: any): IDSPaginator;
}

export interface IDSPaginatorProvider {
    provide(params: any): IDSPaginator;
}
