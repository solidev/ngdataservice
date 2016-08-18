import {Response} from "@angular/http";
export interface IDSResponseParser {
    parse(response: Response): any;
}
