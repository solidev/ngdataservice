import {Response} from "@angular/http";
import {IDSResponseParser} from "./interface";
import {Injectable} from "@angular/core";

@Injectable()
export class DSJsonParser implements IDSResponseParser {
    public parse(response: Response): any {
        return response.json();
    }
}
