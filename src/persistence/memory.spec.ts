import {describe, it} from "@angular/core/testing";
import {LocalStore} from "./memory";
import {Dataobject} from "../component";

class Dao extends Dataobject {
  public name: string;
}

describe("LocalStore", () => {
  it("should be created with params", () => {
    let ls = new LocalStore<Dao>(<any>{});
    expect((<any>ls)._objects).toBeDefined();
  });

  it("should create an empty object from url", () => {
    let ls = new LocalStore<Dao>(<any>{});
    let url = "/path/to/object";
    let sub = ls.create(url);
    expect(sub.subscribe).toBeDefined();
    expect((<any>ls)._meta[url].accessed).toEqual(null);
    expect((<any>ls)._meta[url].updated).toEqual(null);
    expect((<any>ls)._meta[url].pending).toBeTruthy();
  });

  it("should update an existing object, and emit it after updating timestamps", (done) => {
    let ls = new LocalStore<Dao>(<any>{});
    let url = "/path/to/object";
    let sub = ls.create(url);
    let subu = ls.update(url, <any>{name: "TEST"});
    expect(sub).toEqual(subu);
    expect(sub.subscribe).toBeDefined();
    sub.subscribe((obj) => {
      expect(obj.name).toEqual("TEST");
      expect((<any>ls)._meta[url].accessed).toBeDefined();
      expect((<any>ls)._meta[url].updated).toBeDefined();
      expect((<any>ls)._meta[url].pending).toBeFalsy();
      done();
    });
  });

  it("should retrieve an existing object, and emit it after updating timestamps", (done) => {
    let ls = new LocalStore<Dao>(<any>{});
    let url = "/path/to/object";
    let sub = ls.create(url);
    let subu = ls.update(url, <any>{name: "TEST"});
    let [robj, subr] = ls.retrieve(url);
    expect(sub).toEqual(subu);
    expect(subu).toEqual(subr);
    expect(sub).toEqual(subr);
    expect(robj.name).toEqual("TEST");
    done();
  });

  it("should remove old objects", () => {
    console.log("Not implemented");
  });

});
