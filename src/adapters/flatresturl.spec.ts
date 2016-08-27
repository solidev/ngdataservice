import {DSFlatRestUrlAdapter, REST_ADAPTER_CONFIG, DSFlatRestUrlAdapterProvider} from "./flatresturl";
import {expect} from "chai";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {TestBed, inject} from "@angular/core/testing/test_bed";
TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);
describe("DSFlatRestUrlAdapter", () => {
    describe(".identifier()", () => {
        let adapter = new DSFlatRestUrlAdapter({basePath: "/api/trains"});
        it("should append object id to basePath", () => {
            let identifier = adapter.identifier(<any>{id: 12, name: "train"});
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });

        it("should return raw base url if no object given", () => {
            let identifier = adapter.identifier();
            expect(identifier.path).to.equal("/api/trains");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });

        it("should return raw base url if object given has no id", () => {
            let identifier = adapter.identifier(<any>{name: "train"});
            expect(identifier.path).to.equal("/api/trains");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });

        it("should return raw base url if object given and create parameter is set", () => {
            let identifier = adapter.identifier(<any>{id: 12, name: "train"}, {create: true});
            expect(identifier.path).to.equal("/api/trains");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
    });

    describe(".search()", () => {
        let adapter = new DSFlatRestUrlAdapter({basePath: "/api/trains"});
        it("should return basePath", () => {
            let search = adapter.search();
            expect(search.path).to.equal("/api/trains");
            expect(search.query).to.be.empty;
            expect(search.headers).to.be.empty;
        });
    });

    describe("injectability", () => {
        it("should be injected directly using REST_ADAPTER_CONFIG", (done) => {
            TestBed.configureTestingModule({
                providers: [
                    {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/api/trains"}},
                    DSFlatRestUrlAdapter
                ]
            });
            inject([DSFlatRestUrlAdapter], (adapter) => {
                let identifier = adapter.identifier(<any>{id: 12, name: "train"});
                expect(identifier.path).to.equal("/api/trains/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
                done();
            })();
        });
    });
});


describe("DSFlatRestUrlAdapterProvider", () => {

    it("should return an adapter", (done) => {
        TestBed.configureTestingModule({
            providers: [DSFlatRestUrlAdapterProvider]
        });
        inject([DSFlatRestUrlAdapterProvider], (provider) => {
            let adapter = provider.provide({basePath: "/api/trains"});
            let identifier = adapter.identifier(<any>{id: 12, name: "train"});
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
            done();
        })();
    });
});