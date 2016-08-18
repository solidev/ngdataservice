import {Injectable} from "@angular/core";
import {IDSRequestRenderer} from "./interface";

@Injectable()
export class DSJsonRenderer implements IDSRequestRenderer {
    public render(data: any): any {
        return JSON.stringify(data);
    }
}
