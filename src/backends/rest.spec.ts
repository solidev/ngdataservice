import {BaseRequestOptions, Http, Response, RequestMethod, ResponseOptions} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing/mock_backend";
import {REST_BACKEND_CONFIG, DSRestBackend} from "./rest";
import {DSJsonRenderer} from "../renderers/json";
import {DSJsonParser} from "../parsers/json";
import {expect} from "chai";
import * as sinon from "sinon";

import {TestBed, inject} from "@angular/core/testing";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
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

    it("should call GET to api endpoint on retrieve then parse the result", (done) => {
        let connection: MockConnection;
        inject([MockBackend, DSJsonParser, DSRestBackend],
            (mock: MockBackend, parser: DSJsonParser, backend: DSRestBackend) => {
                sinon.spy(parser, "parse");
                mock.connections.subscribe((c) => {
                    connection = c;
                    expect(RequestMethod[connection.request.method]).to.equal("Get");
                    expect(connection.request.url).to.equal("https://example.com:8123/api/v1/trains/12");
                    connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify({id: 12, name: "train"})
                        }))
                    );
                });
                backend.retrieve({path: "/api/v1/trains/12", headers: {}, query: {}}).subscribe((res) => {
                    expect(res.id).to.equal(12);
                    expect((<any>parser).parse.calledOnce).to.equal(true);
                    (<any>parser).parse.restore();
                    done();
                });
            })();
    });

    it("should call GET on api endpoint on list then parse the result", (done) => {
        let connection: MockConnection;
        inject([MockBackend, DSJsonParser, DSRestBackend],
            (mock: MockBackend, parser: DSJsonParser, backend: DSRestBackend) => {
                sinon.spy(parser, "parse");
                mock.connections.subscribe((c) => {
                    connection = c;
                    expect(RequestMethod[connection.request.method]).to.equal("Get");
                    expect(connection.request.url).to.equal("https://example.com:8123/api/v1/trains");
                    connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify([{id: 12, name: "train"}, {id: 13, name: "train"}])
                        }))
                    );
                });
                backend.list({path: "/api/v1/trains", headers: {}, query: {}}).subscribe((res) => {
                    expect(res).to.be.instanceOf(Array);
                    expect((<any>parser).parse.calledOnce).to.equal(true);
                    (<any>parser).parse.restore();
                    done();
                });
            })();
    });

    it("should call POST on api endpoint on create, render payload & parse result", (done) => {
        let connection: MockConnection;
        inject([MockBackend, DSJsonParser, DSJsonRenderer, DSRestBackend],
            (mock: MockBackend, parser: DSJsonParser, renderer: DSJsonRenderer, backend: DSRestBackend) => {
                sinon.spy(parser, "parse");
                sinon.spy(renderer, "render");
                mock.connections.subscribe((c) => {
                    connection = c;
                    expect(RequestMethod[connection.request.method]).to.equal("Post");
                    expect(connection.request.url).to.equal("https://example.com:8123/api/v1/trains");
                    connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify({id: 12, name: "train"})
                        }))
                    );
                });
                backend.create(
                    {path: "/api/v1/trains", headers: {}, query: {}},
                    {name: "train"})
                    .subscribe((res) => {
                        expect(res.id).to.equal(12);
                        expect((<any>parser).parse.calledOnce).to.equal(true);
                        (<any>parser).parse.restore();
                        expect((<any>renderer).render.calledOnce).to.equal(true);
                        (<any>renderer).render.restore();
                        done();
                    });
            })();
    });


    it("should call PUT on api endpoint on update, render payload & parse result", (done) => {
        let connection: MockConnection;
        inject([MockBackend, DSJsonParser, DSJsonRenderer, DSRestBackend],
            (mock: MockBackend, parser: DSJsonParser, renderer: DSJsonRenderer, backend: DSRestBackend) => {
                sinon.spy(parser, "parse");
                sinon.spy(renderer, "render");
                mock.connections.subscribe((c) => {
                    connection = c;
                    expect(RequestMethod[connection.request.method]).to.equal("Put");
                    expect(connection.request.url).to.equal("https://example.com:8123/api/v1/trains/12");
                    connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify({id: 12, name: "trainz"})
                        }))
                    );
                });
                backend.update(
                    {path: "/api/v1/trains/12", headers: {}, query: {}},
                    {id: 12, name: "trainz"})
                    .subscribe((res) => {
                        expect(res.id).to.equal(12);
                        expect(res.name).to.equal("trainz");
                        expect((<any>parser).parse.calledOnce).to.equal(true);
                        (<any>parser).parse.restore();
                        expect((<any>renderer).render.calledOnce).to.equal(true);
                        (<any>renderer).render.restore();
                        done();
                    });
            })();
    });

    it("should call DELETE on api endpoint on destroy, and parse result", (done) => {
        let connection: MockConnection;
        inject([MockBackend, DSJsonParser, DSRestBackend],
            (mock: MockBackend, parser: DSJsonParser, backend: DSRestBackend) => {
                sinon.spy(parser, "parse");
                mock.connections.subscribe((c) => {
                    connection = c;
                    expect(RequestMethod[connection.request.method]).to.equal("Delete");
                    expect(connection.request.url).to.equal("https://example.com:8123/api/v1/trains/12");
                    connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify({id: 12, name: "trainz"})
                        }))
                    );
                });
                backend.destroy({path: "/api/v1/trains/12", headers: {}, query: {}})
                    .subscribe((res) => {
                        expect(res.id).to.equal(12);
                        expect(res.name).to.equal("trainz");
                        expect((<any>parser).parse.calledOnce).to.equal(true);
                        (<any>parser).parse.restore();
                        done();
                    });
            })();
    });

    it("should create headers from identifier, forcing application/json", (done) => {
        inject([DSRestBackend], (backend: DSRestBackend) => {
            let headers = backend.getRequestHeaders({path: "path", headers: {"x-token": "toto"}});
            expect(headers.get("x-token")).to.equal("toto");
            headers = backend.getRequestHeaders({path: "path"});
            expect(headers.values()).to.have.lengthOf(1);
            done();
        })();
    });

    it("should use query parameters from identifier", (done) => {
        inject([DSRestBackend], (backend: DSRestBackend) => {
            let query = backend.getSearchParams({path: "path", query: {"name": "toto"}});
            expect(query.get("name")).to.equal("toto");
            query = backend.getSearchParams({path: "path"});
            expect(query.toString()).to.equal("");
            done();
        })();
    });

    it("should use compute url from parameters and identifier", (done) => {
        inject([DSRestBackend], (backend: DSRestBackend) => {
            let bk: any = <any>backend;
            let id = {path: "/trains"};
            bk._config = {url: "http://example.com/api/v1"};
            expect(backend.getRequestUrl(id)).to.equal("http://example.com/api/v1/trains");
            bk._config = {host: "example.com"};
            expect(backend.getRequestUrl(id)).to.equal("http://example.com:80/trains");
            bk._config = {host: "example.com", port: 30};
            expect(backend.getRequestUrl(id)).to.equal("http://example.com:30/trains");
            bk._config = {host: "example.com", scheme: "ftp"};
            expect(backend.getRequestUrl(id)).to.equal("ftp://example.com:80/trains");
            done();
        })();
    });

});
