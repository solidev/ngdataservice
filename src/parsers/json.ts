import {Response} from "@angular/http";
import {IDSResponseParser, IDSResponseParserProvider} from "./interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSJsonParser implements IDSResponseParser {
    public parse(response: Response): any {
        return response.json();
    }
}

@Injectable()
export class DSJsonParserProvider implements IDSResponseParserProvider {
    public provide(params: any): DSJsonParser {
        return new DSJsonParser();
    }
}