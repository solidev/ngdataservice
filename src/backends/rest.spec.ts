import {HTTP_PROVIDERS, XHRBackend, Http} from "@angular/http";
import {InMemoryBackendService, SEED_DATA, InMemoryBackendConfig} from "../testing/inmemoryapi";
import {Dataobject} from "../component";
import {DataRequest} from "./rest";
import {Injectable} from "@angular/core";
import {IAuthService} from "../auth";

class Dao extends Dataobject {
  public name:string;
}

class DaoData {
  public createDb():any {
    let heroes = [
      {id: 1, name: "Windstorm"},
      {id: 2, name: "Bombasto"},
      {id: 3, name: "Magneta"},
      {id: 4, name: "Tornado"}
    ];
    return {heroes};
  }
}

@Injectable()
class AuthService implements IAuthService {
  public setAuthHeader(header:any):any {
    return header;
  }

  public setAuthContent(content: any): any {
    return content;
  }
}
describe("Datarequest", () => {

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    {provide: XHRBackend, useClass: InMemoryBackendService},
    {provide: SEED_DATA, useClass: DaoData},
    {provide: InMemoryBackendConfig, useValue: {delay: 100, rootPath: "/test"}},
    {provide: AuthService}

  ]);


  it("should be created from auth and http services", inject([Http, AuthService], (http:Http, auth:AuthService) => {
    let dr = new DataRequest(auth, http);
    expect(dr.create).toBeDefined();
  }));

  it("should return a json deserialized observable for get", (done) => {
    inject([Http, AuthService], (http:Http, auth:AuthService) => {
      let dr = new DataRequest(auth, http);
      return dr.retrieveOne("/test/heroes/1")
        .subscribe((result) => {
          expect(result).toEqual({id: 1, name: "Windstorm"});
          done();
        });
    })();
  });

  it("should return a result as info then sequence for getMany", (done) => {
    inject([Http, AuthService], (http:Http, auth:AuthService) => {
      let dr = new DataRequest(auth, http);
      let i:number = 0;
      dr.retrieveList("/test/heroes")
        .subscribe((result) => {
          expect(result._meta.nav.count).toEqual(4);
          expect(result.data[0].id).toEqual(1);
          done();
        });
    })();
  });

  it("should return a result for create", (done) => {
    inject([Http, AuthService], (http:Http, auth:AuthService) => {
      let dr = new DataRequest(auth, http);
      dr.create("/test/heroes", {id: 12, name: "TEST"})
        .subscribe((result) => {
          expect(result.id).toEqual(12);
          done();
        });
    })();
  });

  xit("should return a result for update", (done) => {
    inject([Http, AuthService], (http:Http, auth:AuthService) => {
      let dr = new DataRequest(auth, http);
      dr.update("/test/heroes/3", {name: "TEST"})
        .subscribe((result) => {
          expect(result.name).toEqual("TEST");
          done();
        });
    })();
  });


  it("should return a result for replace", (done) => {
    inject([Http, AuthService], (http:Http, auth:AuthService) => {
      let dr = new DataRequest(auth, http);
      dr.replace("/test/heroes/3", {id: 3})
        .subscribe((result) => {
          expect(result.id).toEqual(3);
          done();
        });
    })();
  });

  it("should return no content for destroy", (done) => {
    inject([Http, AuthService], (http:Http, auth:AuthService) => {
      let dr = new DataRequest(auth, http);
      dr.destroy("/test/heroes/3")
        .subscribe((result) => {
          done();
        });
    })();
  });


});
