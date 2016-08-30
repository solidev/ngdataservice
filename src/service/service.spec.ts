import {DSModel} from "../model/model";
import {DSService} from "./service";
import {expect} from "chai";
import * as sinon from "sinon";
import {DSCollection} from "../collection/collection";


describe("DSService", () => {
    it("should compose setup from provided setup and class values", () => {
        let dss = new DSService<DSModel>();
        dss.model = DSModel;
        dss.setup = {adapter: <any>"A", backend: <any>"B"};
        dss.adapter_provider = <any>"C";
        dss.adapter = <any>"D";
        let setup = dss.getSetup();
        expect(setup.adapter).to.equal("D");
        expect(setup.backend).to.equal("B");
        expect(setup.adapter_provider).to.equal("C");
    });

    it("should return default collection", () => {
        let dss = new DSService<DSModel>();
        dss.model = DSModel;
        dss.setup = {adapter: <any>"A", backend: <any>"B"};
        expect(dss.getCollection()).to.be.instanceOf(DSCollection);
    });

    it("should return custom collection", () => {
        let dss = new DSService<DSModel>();
        dss.model = DSModel;
        dss.collection = <any>sinon.spy();
        dss.setup = {adapter: <any>"A", backend: <any>"B"};
        dss.getCollection();
        expect((<any>dss.collection).callCount).to.equal(1);
    });

    it("should setup model on collection if given", () => {
        let dss = new DSService<DSModel>();
        dss.model = DSModel;
        dss.collection = <any>sinon.spy();
        dss.setup = {adapter: <any>"A", backend: <any>"B"};
        let coll = dss.getCollection();
        expect((<any>dss.collection).callCount).to.equal(1);
        expect(coll.model).to.equal(DSModel);
    });

    it("should not setup model on collection if not given", () => {
        let dss = new DSService<DSModel>();
        dss.collection = <any>sinon.spy();
        dss.setup = {adapter: <any>"A", backend: <any>"B"};
        let coll = dss.getCollection();
        expect((<any>dss.collection).callCount).to.equal(1);
        expect(coll.model).to.be.undefined;
    });

    it("should pass context to collection", () => {
        let dss = new DSService<DSModel>();
        dss.collection = <any>sinon.spy();
        dss.setup = {adapter: <any>"A", backend: <any>"B"};
        let coll = dss.getCollection("toto");
        expect((<any>dss.collection).callCount).to.equal(1);
        expect(coll.model).to.be.undefined;
        expect((<any>dss.collection).args[0][1]).to.equal("toto");
    });
});