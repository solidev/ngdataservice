import {expect} from "chai";
import * as sinon from "sinon";
import {DSModel} from "./model";

describe("DSModel", () => {
    describe("field assignment and validation", () => {

        it("should assign field values", () => {
            let m = new DSModel();
            m.assign();
            m.assign({name: "toto"});
            expect((<any>m).name).to.equal("toto");
        });
        it("should assign field values on creation", () => {
            let m = new DSModel(null, {name: "toto"});
            expect((<any>m).name).to.equal("toto");
        });
        it("should validate fields using validate()", (done) => {
            let m = new DSModel();
            m.validate().subscribe((result) => {
                expect(result).to.equal(true);
                done();
            });
        });
    });

    describe("datastore operations", () => {
        it("should call collection save method on save", () => {
            let save = sinon.spy();
            let m = new DSModel(<any>{save: save});
            m.save();
            expect(save.calledOnce).to.equal(true);
            expect(save.calledWith(m)).to.be.true;
        });
        it("should call collection update method on update", () => {
            let update = sinon.spy();
            let m = new DSModel(<any>{update: update});
            m.update(["name"]);
            expect(update.calledOnce).to.equal(true);
            expect(update.calledWith(m, ["name"])).to.equal(true);
        });
        it("should call collection remove method on remove", () => {
            let remove = sinon.spy();
            let m = new DSModel(<any>{remove: remove});
            m.remove();
            expect(remove.calledOnce).to.equal(true);
        });
        it("should call collection refresh method on refresh", () => {
            let refresh = sinon.spy();
            let m = new DSModel(<any>{refresh: refresh});
            m.refresh();
            expect(refresh.calledOnce).to.equal(true);
            expect(refresh.calledWith(m)).to.be.true;
        });
        it("should raise an error if collection is not defined", () => {
            let m = new DSModel();
            expect(m.save.bind(m)).to.throw("No collection defined");
        });
    });
});
