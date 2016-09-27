import {Headers} from "@angular/http";
export interface IDSAuthentication {
    authenticate(...args: any[]): void;
    anonymous(): void;
    setAuthHeaders(headers: Headers): Headers;
    setAuthContent(content: any): any;
}

export interface IDSAuthenticationClass {
    new(params: any): IDSAuthentication;
}

export interface IDSAuthenticationProvider {
    provide(params: any): IDSAuthentication;
}
