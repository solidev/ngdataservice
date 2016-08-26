import {IDSPaginator, IDSPaginatorProvider} from "./interface";
import {Injectable, OpaqueToken, Inject} from "@angular/core";

export let PAGINATOR_CONFIG = new OpaqueToken("backend.res.config");


@Injectable()
export class DSPagePaginator implements IDSPaginator {
    constructor(@Inject(PAGINATOR_CONFIG) protected _config: any) {
    }

    public getPaginationInfos(result: any): any {
        return {page: 2, count: 3};
    }
}

@Injectable()
export class DSPagePaginatorProvider implements IDSPaginatorProvider {
    public provide(params: any): IDSPaginator {
        return new DSPagePaginator(params);
    };
}

