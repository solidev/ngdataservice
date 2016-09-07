import {DSJsonRenderer, DSJsonRendererProvider} from "./json";
import {expect} from "chai";
import {TestBed, inject} from "@angular/core/testing";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing"
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe("DSJsonRenderer", () => {
    it("should return JSON stringified data", () => {
        let r = new DSJsonRenderer();
        let o = {id: 12, name: "train"};
        expect(r.render(o)).to.equal(JSON.stringify(o));
    });
});


describe("DSJsonRendererProvider", () => {
    it("should return a renderer", (done) => {
        TestBed.configureTestingModule({
            providers: [DSJsonRendererProvider]
        });
        inject([DSJsonRendererProvider], (provider) => {
            let pers = provider.provide();
            expect(pers).to.be.instanceOf(DSJsonRenderer);
            done();
        })();

    });
});

