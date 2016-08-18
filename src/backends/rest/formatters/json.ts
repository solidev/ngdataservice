import {IRestFormatter} from "./interface";
import {Response} from "@angular/http";
export class JsonRestFormatter implements IRestFormatter {
    public fromResponse(response: Response): any {
        return response.json();
    }

    public toRequest(data: any): any {
        return JSON.stringify(data);
    }
}
