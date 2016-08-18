import {Response} from "@angular/http";
export interface IRestFormatter {
    fromResponse(response: Response): any;
    toRequest(data: any): any;
}
