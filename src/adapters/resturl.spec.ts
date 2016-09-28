import {DSRestUrlAdapter, REST_ADAPTER_CONFIG, DSFlatRestUrlAdapterProvider} from "./resturl";
import {expect} from "chai";
import {TestBed, inject} from "@angular/core/testing";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {DSModel} from "../model/model";

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
describe("DSRestUrlAdapter - flat url", () => {
    describe(".identifier()", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should append object id to basePath", () => {
            let identifier = adapter.identifier(<any>{_pk: 12, name: "train"});
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });

        it("should return null if no object given", () => {
            let identifier = adapter.identifier();
            expect(identifier).to.be.null;
        });

        it("should return null if object given has no id", () => {
            let identifier = adapter.identifier(<any>{name: "train"});
            expect(identifier).to.be.null;
        });

        it("should return identifier if instance is a number", () => {
            let identifier = adapter.identifier(12);
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });

        it("should return identifier if instance is a string", () => {
            let identifier = adapter.identifier("12");
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
    });
    describe(".identifier({create: true})", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should return raw base url if object given wo id and create parameter is set", () => {
            let identifier = adapter.identifier(<any>{name: "train"}, {create: true});
            expect(identifier.path).to.equal("/api/trains");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
        it("should return raw base url if object pk given but create parameter is set", () => {
            let identifier = adapter.identifier(<any>{_pk: 12, name: "train"}, {create: true});
            expect(identifier.path).to.equal("/api/trains");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
    });

    describe(".identifier({local: true})", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should return a local identifier (created) from instance", () => {
            let obj = new DSModel(null, {name: "toto"});
            let identifier = adapter.identifier(obj, {local: true});
            expect(identifier.path).to.contain("?__local__/api/trains/");
            expect(obj._local).not.to.be.undefined;
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
    });
    describe(".search()", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should return basePath", () => {
            let search = adapter.search();
            expect(search.path).to.equal("/api/trains");
            expect(search.query).to.be.empty;
            expect(search.headers).to.be.empty;
        });

        it("should add search parameters", () => {
            let search = adapter.search({filter: {name: "train"}});
            expect(search.path).to.equal("/api/trains");
            expect(search.query).to.be.have.property("name").and.to.equal("train");
            expect(search.headers).to.be.empty;
        });
    });

    describe("DSRestUrlAdapter - template url", () => {
        describe(".identifier()", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains/${train.id}/wagons"});
            it("should append object id to basePath", () => {
                let identifier = adapter.identifier(<any>{_pk: 12, name: "train"}, {context: {train: {id: 1}}});
                expect(identifier.path).to.equal("/api/trains/1/wagons/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });

            it("should return null if object given has no id", () => {
                let identifier = adapter.identifier(<any>{name: "train"});
                expect(identifier).to.be.null;
            });

            it("should return identifier if instance is a number", () => {
                let identifier = adapter.identifier(12, {context: {train: {id: 1}}});
                expect(identifier.path).to.equal("/api/trains/1/wagons/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });

            it("should return identifier if instance is a string", () => {
                let identifier = adapter.identifier("12", {context: {train: {id: 1}}});
                expect(identifier.path).to.equal("/api/trains/1/wagons/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
        });
        describe(".identifier({create: true})", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
            it("should return raw base url if object given wo id and create parameter is set", () => {
                let identifier = adapter.identifier(<any>{name: "train"}, {create: true});
                expect(identifier.path).to.equal("/api/trains");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
            it("should return raw base url if object pk given but create parameter is set", () => {
                let identifier = adapter.identifier(<any>{_pk: 12, name: "train"}, {create: true});
                expect(identifier.path).to.equal("/api/trains");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
        });

        describe(".identifier({local: true})", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains/${train.id}/wagons"});
            it("should return a local identifier (created) from instance", () => {
                let obj = new DSModel(null, {name: "toto"});
                let identifier = adapter.identifier(obj, {local: true, context: {train: {id: 1}}});
                expect(identifier.path).to.contain("?__local__/api/trains/");
                expect(obj._local).not.to.be.undefined;
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
        });
        describe(".search()", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains/${train.id}/wagons"});
            it("should return basePath", () => {
                let search = adapter.search({context: {train: {id: 1}});
                expect(search.path).to.equal("/api/trains/1/wagons");
                expect(search.query).to.be.empty;
                expect(search.headers).to.be.empty;
            });

            it("should add search parameters", () => {
                let search = adapter.search({filter: {name: "train"}, context: {train: {id: 1}}});
                expect(search.path).to.equal("/api/trains/1/wagons");
                expect(search.query).to.be.have.property("name").and.to.equal("train");
                expect(search.headers).to.be.empty;
            });
        });
    });


    describe("injectability", () => {
        it("should be injected directly using REST_ADAPTER_CONFIG", (done) => {
            TestBed.configureTestingModule({
                providers: [
                    {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/api/trains"}},
                    DSRestUrlAdapter
                ]
            });
            inject([DSRestUrlAdapter], (adapter) => {
                let identifier = adapter.identifier(<any>{_pk: 12, name: "train"});
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
            let identifier = adapter.identifier(<any>{_pk: 12, name: "train"});
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
            done();
        })();
    });
});
