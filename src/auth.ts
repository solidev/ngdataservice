import {Headers} from "@angular/http";
export interface IAuthService {
    setAuthHeader(headers: Headers): Headers;
    setAuthContent(content: any): any;
}