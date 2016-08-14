import {describe, it} from "@angular/core/testing";
import {DatastoresService} from "./store";


describe("DatastoresService", () => {
  it("should register and return datastores", () => {
    let dss = new DatastoresService();
    dss.register("ds1", <any>{name: "ds1"});
    dss.register("ds2", <any>{name: "ds2"});
    let ds1: any = dss.get("ds1");
    expect(ds1.name).toEqual("ds1");
  });
});

