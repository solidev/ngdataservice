import {Headers} from "@angular/http";
export interface IDSAuthentication {
    authenticate(...args: string[]): void;
    anonymous(): void;
    setAuthHeaders(headers: Headers): Headers;
    setAuthContent(content: any): any;
}

export interface IDSAuthenticationProvider {
    provide(params: any): IDSAuthentication;
}