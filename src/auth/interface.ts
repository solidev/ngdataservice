import {Headers} from "@angular/http";
export interface IAuthService {
    setAuthHeaders(headers: Headers): Headers;
    setAuthContent(content: any): any;
}