import {IDSPaginator, IDSPaginatorProvider} from "./interface";
import {Inject, Injectable, InjectionToken, Optional} from "@angular/core";

export let PAGINATOR_PAGE_CONFIG = new InjectionToken<any>("paginator.page.config");


@Injectable()
export class DSPagePaginator implements IDSPaginator {
    public page: number;
    public page_size: number;
    public page_parameter: string;
    public page_size_parameter: string;

    constructor(@Optional() @Inject(PAGINATOR_PAGE_CONFIG) protected _config: any) {
        if (!this._config) {
            this._config = {};
        }
        this.page = this._config.page || 1;
        this.page_size = this._config.page_size || 100;
        this.page_parameter = this._config.page_parameter || "page";
        this.page_size_parameter = this._config.page_size_parameter || "page_size";
    }

    public getPaginationInfos(result: any): any {
        if (result.nav) {
            this.page = result.nav.page;
            this.page_size = result.nav.size;
            return {nav: result.nav, parameters: result.parameters};
        } else {
            return {};
        }
    }

    public getResults(results: any): any {
        if (results.nav) {
            return results.results;
        } else {
            return results;
        }
    }

    public update(params: any): void {
        if (params.page) {
            this.page = params.page;
        }
        if (params.page_size) {
            this.page_size = params.page_size;
        }
    }

    public get backendPaginate(): any {
        let pagination = {};
        pagination[this.page_parameter] = this.page;
        pagination[this.page_size_parameter] = this.page_size;
        return pagination;
    }

    public get localPaginate(): any {
        let pagination = {};
        pagination[this.page_parameter] = this.page;
        pagination[this.page_size_parameter] = this.page_size;
        return pagination;
    }
}

@Injectable()
export class DSPagePaginatorProvider implements IDSPaginatorProvider {
    public provide(params: any): IDSPaginator {
        return new DSPagePaginator(params);
    };
}

