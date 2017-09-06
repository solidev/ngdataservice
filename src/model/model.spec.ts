import {expect} from "chai";
import * as sinon from "sinon";
import {DSModel} from "./model";
import {Observable} from "rxjs/Observable";

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
            // TODO: implement validation tests
            let m = new DSModel();
            (<Observable<boolean>>m.validate()).subscribe((result) => {
                expect(result).to.equal(true);
                done();
            });
        });
        it("should generate a local id on demand", () => {
            let m = new DSModel();
            expect(m._local).not.to.be.undefined;
        });
        it("should return object's primary key", () => {
            let m = new DSModel();
            (<any>m).id = 12;
            expect(m._pk).to.equal(12);
        });

        xit("should check dirty fields", () => {
            // TODO: implement dirty checking tests
            expect(false).to.be.true;
        });

        it("should export to json with secure fields only", () => {
            let m = new DSModel();
            (<any>m).id = 12;
            expect(m._pk).to.equal(12);
            expect(JSON.parse(JSON.stringify(m))).not.to.have.property("_pk");
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
