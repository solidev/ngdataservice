import {Headers} from "@angular/http";
export interface IAuthService {
    authenticate(...args: string[]): void;
    anonymous(): void;
    setAuthHeaders(headers: Headers): Headers;
    setAuthContent(content: any): any;
}