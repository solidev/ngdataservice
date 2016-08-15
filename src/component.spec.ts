import {Dataobject} from "./component";
import createSpy = jasmine.createSpy;

describe("Component", () => {
  it("should be created using a datastore", () => {
    let ds = {};
    let dao = new Dataobject(<any>ds);
    expect(dao.id).toEqual(-1);
  });

  it("should be created without using a datastore", () => {
    let dao = new Dataobject();
    expect(dao.id).toEqual(-1);
  });

  it("should call datastore save() function", () => {
    let ds = {save: createSpy("save")};
    let dao = new Dataobject(null, <any>ds);
    dao.save();
    expect((<any>ds).save).toHaveBeenCalledWith(dao);
  });

  it("should call datastore remove function", () => {
    let ds = {remove: createSpy("remove")};
    let dao = new Dataobject(null, <any>ds);
    dao.remove();
    expect((<any>ds).remove).toHaveBeenCalledWith(dao);
  });

  it("should call datastore refresh function", () => {
    let ds = {refresh: createSpy("refresh")};
    let dao = new Dataobject(null, <any>ds);
    dao.refresh();
    expect((<any>ds).refresh).toHaveBeenCalledWith(dao);
  });

  // it("should call datastore getObjectUrl function", () => {
  //   let ds = {getObjectUrl: createSpy("getObjectUrl")};
  //   let dao = new Dataobject(null, <any>ds);
  //   dao.getUrl();
  //   expect((<any>ds).getObjectUrl).toHaveBeenCalledWith(dao);
  // });

  it("should omit _ an $ keys on toJSON", () => {
    let dao:any = new Dataobject();
    dao["_under"] = true;
    dao["$dollar"] = true;
    dao["normal"] = true;
    let out:any = dao.toJSON();
    expect(out._under).not.toBeDefined();
    expect(out.$under).not.toBeDefined();
    expect(out.normal).toBeDefined();
    expect(out._ds).not.toBeDefined();
    expect(out._url).not.toBeDefined();
  });

  it("should throw an error on calling functions if no datastore is present", () => {
    let dao = new Dataobject();
    let save = function ():void {
      dao.save();
    };
    let remove = function ():void {
      dao.remove();
    };
    let refresh = function ():void {
      dao.refresh();
    };
    // let getUrl = function ():void {
    //   dao.getUrl();
    // };
    expect(save).toThrowError("Datastore not defined");
    expect(remove).toThrowError("Datastore not defined");
    expect(refresh).toThrowError("Datastore not defined");
    // expect(getUrl).toThrowError("Datastore not defined");
  });


});
