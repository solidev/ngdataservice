import { Response } from "@angular/http";

export type IDSResponseParserParseParams = any;

export interface IDSResponseParser {
    parse(response: Response, params?: IDSResponseParserParseParams): any;
}

export interface IDSResponseParserClass {
    new(params: any): IDSResponseParser;
}

export interface IDSResponseParserProvider {
    provide(params: any): IDSResponseParser;
}
