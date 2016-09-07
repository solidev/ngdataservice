import {expect} from "chai";
import * as sinon from "sinon";


import {DSJsonParser, DSJsonParserProvider} from "./json";
describe("DSJsonParser", () => {
    it("should return parsed json response", () => {
        let resp = {json: sinon.stub()};
        resp.json.returns(123);
        let parser = new DSJsonParser();
        expect(parser.parse(<any>resp)).to.equal(123);
        expect(resp.json.called).to.equal(true);
    });
});



describe("DSJsonParserProvider", () => {
    it("should provide a fresh instance of json parser", () => {
        let prov = new DSJsonParserProvider();
        expect(prov.provide()).to.be.an.instanceof(DSJsonParser);
    });
});

