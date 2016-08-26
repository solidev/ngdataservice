import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {TestBed, inject} from "@angular/core/testing/test_bed";
import {DSJsonParserProvider} from "../parsers/json";
import {expect} from "chai";
TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

let comp: any;
describe("My test", () => {
    beforeEach((done) => {
        TestBed.configureTestingModule({
            providers: [DSJsonParserProvider],
        });
        inject([DSJsonParserProvider], (par) => {
            comp = par;
            done();
        })();
    });

    it("should be successful", () => {
        console.log(comp);
        expect(comp.provide().parse).to.not.be.undefined;
    });
});
