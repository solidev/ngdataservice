import {Injectable} from "@angular/core";
import {IDSPaginator, IDSPaginatorProvider} from "./interface";
@Injectable()
export class DSDummyPaginator implements IDSPaginator {
    public getPaginationInfos(result: any): any {
        return {};
    }

    public getResults(result: any): any {
        return result;
    }
}


@Injectable()
export class DSDummyPaginatorProvider implements IDSPaginatorProvider {
    public provide(params: any): IDSPaginator {
        return new DSDummyPaginator();
    }
}
