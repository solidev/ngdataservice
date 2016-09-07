import {DSDefaultSerializer, DSDefaultSerializerProvider} from "./default";
import {expect} from "chai";
import {TestBed, inject} from "@angular/core/testing";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing"
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe("DSDefaultSerializer", () => {
    it("should serialize an object omitting _ and $ properties", () => {
        let ser = new DSDefaultSerializer();
        let obj = {name: "toto", _name: "titi", $name: "tata"};
        expect(ser.serialize(<any>obj)).to.have.all.keys(["name"]);
    });

    it("should deserialize an object as no-op", () => {
        let ser = new DSDefaultSerializer();
        let obj = {name: "toto", _name: "titi", $name: "tata"};
        expect(ser.deserialize(<any>obj)).to.equal(obj);
    });

    it("should serialize an array of objects", () => {
        let ser = new DSDefaultSerializer();
        let obj1 = {name: "toto", _name: "titi", $name: "tata"};
        let obj2 = {name: "zozo", _name: "zizi", $name: "zaza"};
        let res = ser.serializeMany(<any>[obj1, obj2]);
        expect(res[0]).to.have.all.keys(["name"]);
        expect(res[1]).to.have.all.keys(["name"]);
    });

    it("should deserialize an array of objects", () => {
        let ser = new DSDefaultSerializer();
        let obj1 = {name: "toto", _name: "titi", $name: "tata"};
        let obj2 = {name: "zozo", _name: "zizi", $name: "zaza"};
        let res = ser.deserializeMany(<any>[obj1, obj2]);
        expect(res[0]).to.equal(obj1);
        expect(res[1]).to.equal(obj2);
    });


});


describe("DSDefaultSerializerProvider", () => {
    it("should return a serializer", (done) => {
        TestBed.configureTestingModule({
            providers: [DSDefaultSerializerProvider]
        });
        inject([DSDefaultSerializerProvider], (provider) => {
            let pers = provider.provide();
            expect(pers).to.be.instanceOf(DSDefaultSerializer);
            done();
        })();

    });
});
