import {expect} from "chai";
import {DSLocalstoragePersistence, DSLocalstoragePersistenceProvider} from "./localstorage";
import {TestBed, inject} from "@angular/core/testing";
describe("DSLocalstoragePersistence", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });


    it("should be a JSON type persistence", () => {
        let mp = new DSLocalstoragePersistence();
        expect(mp.type).to.equal("JSON");
    });
    it("can allow own storage name", () => {
        let mp = new DSLocalstoragePersistence();
        expect(mp.type).to.equal("JSON");
    });
    it("should save an item", () => {
        let mp = new DSLocalstoragePersistence();
        let obj = {id: 12, name: "train"};
        expect(JSON.stringify(mp.save({path: "/trains/12"}, obj))).to.equal(JSON.stringify(obj));
        expect(mp.list()).to.have.lengthOf(1);

    });
    it("should retrieve an item by id", () => {
        let mp = new DSLocalstoragePersistence();
        let obj = {id: 12, name: "train"};
        expect(JSON.stringify(mp.save({path: "/trains/12"}, obj))).to.equal(JSON.stringify(obj));
        expect(JSON.stringify(mp.retrieve({path: "/trains/12"}))).to.equal(JSON.stringify(obj));
    });
    it("should destroy an item by id", () => {
        let mp = new DSLocalstoragePersistence();
        let obj = {id: 12, name: "train"};
        expect(JSON.stringify(mp.save({path: "/trains/12"}, obj))).to.equal(JSON.stringify(obj));
        mp.destroy({path: "/trains/12"});
        expect(mp.retrieve({path: "/trains/12"})).to.be.undefined;
        expect(mp.list()).to.have.lengthOf(0);

    });
    it("should clear all items with clear", () => {
        let mp = new DSLocalstoragePersistence();
        mp.save({path: "/trains/12"}, "obj1");
        mp.save({path: "/trains/13"}, "obj2");
        expect(mp.list()).to.have.lengthOf(2);
        mp.clear();
        expect(mp.list()).to.have.lengthOf(0);
    });
});

describe("DSLocalstoragePersistenceProvider", () => {
    it("should return a localstorage persistence store", (done) => {
        TestBed.configureTestingModule({
            providers: [DSLocalstoragePersistenceProvider]
        });
        inject([DSLocalstoragePersistenceProvider], (provider) => {
            let pers = provider.provide();
            expect(pers).to.be.instanceOf(DSLocalstoragePersistence);
            done();
        })();

    });
});
