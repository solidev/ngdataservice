import {IDSPaginator, IDSPaginatorProvider} from "./interface";
import {Injectable, OpaqueToken, Inject, Optional} from "@angular/core";

export let PAGINATOR_PAGE_CONFIG = new OpaqueToken("paginator.page.config");


@Injectable()
export class DSPagePaginator implements IDSPaginator {
    constructor(@Optional() @Inject(PAGINATOR_PAGE_CONFIG) protected _config: any) {
        if (!this._config) {
            this._config = {};
        }
    }

    public getPaginationInfos(result: any): any {
        return {page: 2, count: 3};
    }

    public getResults(results: any): any {
        return results;
    }
}

@Injectable()
export class DSPagePaginatorProvider implements IDSPaginatorProvider {
    public provide(params: any): IDSPaginator {
        return new DSPagePaginator(params);
    };
}

