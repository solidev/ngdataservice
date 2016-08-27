import {BaseRequestOptions, Http, Response, ResponseOptions} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing/mock_backend";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {TestBed, inject} from "@angular/core/testing/test_bed";
import {REST_BACKEND_CONFIG, DSRestBackend} from "./rest";
import {DSJsonRenderer} from "../renderers/json";
import {DSJsonParser} from "../parsers/json";
import {expect} from "chai";

TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

describe("DSRestBackend", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => {
                        return new Http(backend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                DSJsonParser,
                DSJsonRenderer,
                {
                    provide: REST_BACKEND_CONFIG,
                    useValue: {host: "example.com", port: 8123, scheme: "https"}
                },
                DSRestBackend
            ]
        });
    });

    it("should call GET to api endpoint on retrieve", (done) => {
        let connection: MockConnection;
        inject([MockBackend, DSRestBackend], (mock: MockBackend, backend: DSRestBackend) => {
            mock.connections.subscribe((c) => {
                connection = c;
                expect(connection.request.url).to.equal("https://example.com:8123/api/v1/trains/12");
                connection.mockRespond(
                    new Response(new ResponseOptions({
                        body: JSON.stringify({id: 12, name: "train"})
                    }))
                );
            });
            backend.retrieve({path: "/api/v1/trains/12", headers: {}, query: {}}).subscribe((res) => {
                expect(res.id).to.equal(12);
                done();
            });
        })();
    });
});
