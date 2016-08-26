import {Response} from "@angular/http";
export interface IDSResponseParser {
    parse(response: Response): any;
}

export interface IDSResponseParserProvider {
    provide(params: any): IDSResponseParser;
}