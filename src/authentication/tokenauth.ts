// Sample authentication service.
import {IDSAuthentication, IDSAuthenticationProvider} from "./interface";
import {Headers} from "@angular/http";
import {Injectable} from "@angular/core";


@Injectable()
export class DSTokenAuthentication implements IDSAuthentication {
    private _token: string;
    private _header: string;
    private _authenticated: boolean = false;

    public authenticate(token: string, header: string = "X-Token"): void {
        this._token = token;
        this._header = header;
        this._authenticated = true;
    }

    public anonymous():void {
        this._token = null;
        this._header = null;
        this._authenticated = false;
    }

    public setAuthHeaders(headers: Headers): Headers {
        if (this._authenticated) {
            headers.set(this._header, this._token);
        }
        return headers;
    }

    public setAuthContent(content: any): any {
        return content;
    }
}


@Injectable()
export class DSTokenAuthenticationProvider implements IDSAuthenticationProvider {
    public provide(): IDSAuthentication {
        return new DSTokenAuthentication();
    }
}
