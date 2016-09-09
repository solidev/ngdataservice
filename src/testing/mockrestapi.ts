import {BaseRequestOptions, Http, RequestMethod, ResponseOptions, Response} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing/mock_backend";
import {Injectable} from "@angular/core";
export const MOCK_REST_API_PROVIDER = [
    MockBackend,
    BaseRequestOptions,
    {
        provide: Http,
        useFactory: (backend, options) => {
            return new Http(backend, options);
        },
        deps: [MockBackend, BaseRequestOptions]
    }
];


export interface IDSMockRequest {
    method?: string;
    url: string;
    body: any;
    order?: boolean;
}

@Injectable()
export class DSMockRestApi {
    public connection: MockConnection;
    public _responses: IDSMockRequest[] = [];
    public _count: number = 1;

    constructor(public backend: MockBackend) {
        backend.connections.subscribe((c) => {
            this.connection = c;
            this.response();
        });
    }

    public addResponse(request: IDSMockRequest): void {
        this._responses.push(request);
    }

    public response(): void {
        let method = RequestMethod[this.connection.request.method].toUpperCase();
        let url = this.connection.request.url;
        let respcount = 0;

        for (let response of this._responses) {
            let respmethod = (response.method || "GET").toUpperCase();
            respcount++;
            console.log(respmethod, method, respmethod === method);
            console.log(response.url, url, response.url === url);
            console.log(response.order, respcount, this._count);
            let valid = true;
            if ((respmethod === method) &&
                (response.url === url)) {

                if (response.order) {
                    valid = valid && (respcount === this._count);
                }
                if (valid) {
                    this._count++;
                    this.connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify(response.body)
                        })));
                    return;
                }
            }
        }
        throw new Error(`API Response error : ${method} ${url} not found`);

    }
}

