import {DSRestUrlAdapter, REST_ADAPTER_CONFIG, DSRestUrlAdapterProvider} from "./resturl";
import {expect} from "chai";
import {TestBed, inject} from "@angular/core/testing";
import {DSModel} from "../model/model";


describe("DSRestUrlAdapter - flat url", () => {
    describe(".detail()", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should append object id to basePath", () => {
            let identifier = adapter.detail(<any>{_pk: 12, name: "train"});
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });

        it("should return null if no object given", () => {
            let identifier = adapter.detail();
            expect(identifier).to.be.null;
        });

        it("should return null if object given has no id", () => {
            let identifier = adapter.detail(<any>{name: "train"});
            expect(identifier).to.be.null;
        });

        it("should return detail if instance is a number", () => {
            let identifier = adapter.detail(12);
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });

        it("should return detail if instance is a string", () => {
            let identifier = adapter.detail("12");
            expect(identifier.path).to.equal("/api/trains/12");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
    });
    describe(".detail({create: true})", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should return raw base url if object given wo id and create parameter is set", () => {
            let identifier = adapter.detail(<any>{name: "train"}, {create: true});
            expect(identifier.path).to.equal("/api/trains");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
        it("should return raw base url if object pk given but create parameter is set", () => {
            let identifier = adapter.detail(<any>{_pk: 12, name: "train"}, {create: true});
            expect(identifier.path).to.equal("/api/trains");
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
    });

    describe(".detail({local: true})", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should return a local detail (created) from instance", () => {
            let obj = new DSModel(null, {name: "toto"});
            let identifier = adapter.detail(obj, {local: true});
            expect(identifier.path).to.contain("?__local__/api/trains/");
            expect(obj._local).not.to.be.undefined;
            expect(identifier.query).to.be.empty;
            expect(identifier.headers).to.be.empty;
        });
    });
    describe(".list()", () => {
        let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
        it("should return basePath", () => {
            let list = adapter.list();
            expect(list.path).to.equal("/api/trains");
            expect(list.query).to.be.empty;
            expect(list.headers).to.be.empty;
        });

        it("should add list parameters", () => {
            let list = adapter.list({filter: {name: "train"}});
            expect(list.path).to.equal("/api/trains");
            expect(list.query).to.be.have.property("name").and.to.equal("train");
            expect(list.headers).to.be.empty;
        });
    });

    describe("DSRestUrlAdapter - template url", () => {
        describe(".detail()", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains/${train.id}/wagons"});
            it("should append object id to basePath", () => {
                let identifier = adapter.detail(<any>{_pk: 12, name: "train"}, {context: {train: {id: 1}}});
                expect(identifier.path).to.equal("/api/trains/1/wagons/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });

            it("should return null if object given has no id", () => {
                let identifier = adapter.detail(<any>{name: "train"});
                expect(identifier).to.be.null;
            });

            it("should return detail if instance is a number", () => {
                let identifier = adapter.detail(12, {context: {train: {id: 1}}});
                expect(identifier.path).to.equal("/api/trains/1/wagons/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });

            it("should return detail if instance is a string", () => {
                let identifier = adapter.detail("12", {context: {train: {id: 1}}});
                expect(identifier.path).to.equal("/api/trains/1/wagons/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
        });
        describe(".detail({create: true})", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains"});
            it("should return raw base url if object given wo id and create parameter is set", () => {
                let identifier = adapter.detail(<any>{name: "train"}, {create: true});
                expect(identifier.path).to.equal("/api/trains");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
            it("should return raw base url if object pk given but create parameter is set", () => {
                let identifier = adapter.detail(<any>{_pk: 12, name: "train"}, {create: true});
                expect(identifier.path).to.equal("/api/trains");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
        });

        describe(".detail({local: true})", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains/${train.id}/wagons"});
            it("should return a local detail (created) from instance", () => {
                let obj = new DSModel(null, {name: "toto"});
                let identifier = adapter.detail(obj, {local: true, context: {train: {id: 1}}});
                expect(identifier.path).to.contain("?__local__/api/trains/");
                expect(obj._local).not.to.be.undefined;
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            });
        });
        describe(".list()", () => {
            let adapter = new DSRestUrlAdapter({basePath: "/api/trains/${train.id}/wagons"});
            it("should return basePath", () => {
                let list = adapter.list({context: {train: {id: 1}}});
                expect(list.path).to.equal("/api/trains/1/wagons");
                expect(list.query).to.be.empty;
                expect(list.headers).to.be.empty;
            });

            it("should add list parameters", () => {
                let list = adapter.list({filter: {name: "train"}, context: {train: {id: 1}}});
                expect(list.path).to.equal("/api/trains/1/wagons");
                expect(list.query).to.be.have.property("name").and.to.equal("train");
                expect(list.headers).to.be.empty;
            });
        });
    });


    describe("injectability", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    DSRestUrlAdapter,
                    {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/api/trains"}},

                ]
            });
        });

        it("should be injected directly using REST_ADAPTER_CONFIG",
            inject([DSRestUrlAdapter], (adapter: DSRestUrlAdapter) => {
                let identifier = adapter.detail(<any>{_pk: 12, name: "train"});
                expect(identifier.path).to.equal("/api/trains/12");
                expect(identifier.query).to.be.empty;
                expect(identifier.headers).to.be.empty;
            }));
    });
});


describe("DSRestUrlAdapterProvider", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DSRestUrlAdapterProvider]
        });
    });
    it("should return an adapter", inject([DSRestUrlAdapterProvider], (provider) => {
        let adapter = provider.provide({basePath: "/api/trains"});
        let identifier = adapter.detail(<any>{_pk: 12, name: "train"});
        expect(identifier.path).to.equal("/api/trains/12");
        expect(identifier.query).to.be.empty;
        expect(identifier.headers).to.be.empty;
    }));

});
