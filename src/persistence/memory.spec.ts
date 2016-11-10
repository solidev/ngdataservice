import {expect} from "chai";
import {DSMemoryPersistence, DSMemoryPersistenceProvider} from "./memory";
import {TestBed, inject} from "@angular/core/testing";

describe("DSMemoryPersistence", () => {
    it("should be an OBJ type persistence", () => {
        let mp = new DSMemoryPersistence();
        expect(mp.type).to.equal("OBJ");
    });
    it("should save an item", () => {
        let mp = new DSMemoryPersistence();
        let obj = {id: 12, name: "train"};
        expect(mp.save({path: "/trains/12"}, obj)).to.equal(obj);
        expect(mp.list()).to.have.lengthOf(1);

    });
    it("should retrieve an item by id", () => {
        let mp = new DSMemoryPersistence();
        let obj = {id: 12, name: "train"};
        expect(mp.save({path: "/trains/12"}, obj)).to.equal(obj);
        expect(mp.retrieve({path: "/trains/12"})).to.equal(obj);
    });
    it("should destroy an item by id", () => {
        let mp = new DSMemoryPersistence();
        let obj = {id: 12, name: "train"};
        expect(mp.save({path: "/trains/12"}, obj)).to.equal(obj);
        mp.destroy({path: "/trains/12"});
        expect(mp.retrieve({path: "/trains/12"})).to.be.undefined;
        expect(mp.list()).to.have.lengthOf(0);

    });
    it("should clear all items with clear", () => {
        let mp = new DSMemoryPersistence();
        mp.save({path: "/trains/12"}, "obj1");
        mp.save({path: "/trains/13"}, "obj2");
        expect(mp.list()).to.have.lengthOf(2);
        mp.clear();
        expect(mp.list()).to.have.lengthOf(0);
    });
});

describe("DSMemoryPersistenceProvider", () => {
    it("should return a memory persistence store", (done) => {
        TestBed.configureTestingModule({
            providers: [DSMemoryPersistenceProvider]
        });
        inject([DSMemoryPersistenceProvider], (provider) => {
            let pers = provider.provide();
            expect(pers).to.be.instanceOf(DSMemoryPersistence);
            done();
        })();

    });
});
