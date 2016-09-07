export interface IDSPaginator {
    getPaginationInfos(result: any): any;
    getResults(result: any): any;
}

export interface IDSPaginatorProvider {
    provide(params: any): IDSPaginator;
}
