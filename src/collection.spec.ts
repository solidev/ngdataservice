import {describe, it, beforeEachProviders, inject} from "@angular/core/testing";
import {Dataobject} from "./component";
import {Datastore} from "./collection";
import {DatastoresService} from "./store";
import {HTTP_PROVIDERS, XHRBackend, Http} from "@angular/http";
import {InMemoryBackendService, SEED_DATA, InMemoryBackendConfig} from "./testing/inmemoryapi";
import {IAuthService} from "./auth";
import {Injectable} from "@angular/core";


export class DaoData {
    public createDb():any {
        let heroes = [
            {id: "1", name: "Windstorm"},
            {id: "2", name: "Bombasto"},
            {id: "3", name: "Magneta"},
            {id: "4", name: "Tornado"}
        ];
        return {heroes};
    }
}

@Injectable()
class AuthService implements IAuthService {
    public setAuthHeader(header:any):any {
        return header;
    }

    public setAuthContent(content:any):any {
        return content;
    }

}

class Dao extends Dataobject {
    public name:string;
}

describe("Datastore", () => {
    beforeEachProviders(() => [
        HTTP_PROVIDERS,
        DatastoresService,
        {provide: XHRBackend, useClass: InMemoryBackendService},
        {provide: SEED_DATA, useClass: DaoData},
        {provide: InMemoryBackendConfig, useValue: {delay: 100}},
        {provide: AuthService}
    ]);

    it("should be created using minimal params and register to dss service using baseUrl", (done) => {
        inject([Http, AuthService, DatastoresService],
            (http:Http, auth:AuthService, dss:DatastoresService) => {
                let ds = new Datastore<Dao>(
                    {objectUrl: "api/heroes/{id}", listUrl: "api/heroes"},
                    Dao, dss, http, auth);
                expect(dss.get("api/heroes")).toEqual(ds);
                expect((<any>ds)._params.trailingSlash).toEqual(false);
                expect((<any>ds)._params.maxAge).toEqual(3600 * 24 * 30);
                expect((<any>ds)._params.maxItems).toEqual(1000000);
                expect((<any>ds)._params.storeQueries).toEqual(false);
                expect((<any>ds)._params.storeCustom).toEqual(false);
                expect((<any>ds)._params.authenticated).toEqual(true);
                expect((<any>ds)._params.ignore.path.length).toEqual(0);
                expect((<any>ds)._params.ignore.search.length).toEqual(0);
                done();
            })();
    });

    it("should allow creation of naked object using base class", (done) => {
        inject([Http, AuthService, DatastoresService],
            (http:Http, auth:AuthService, dss:DatastoresService) => {
                let ds = new Datastore<Dao>(
                    {objectUrl: "/heroes/{id}", listUrl: "/heroes"},
                    Dao, dss, http, auth);
                expect(ds.create({name: "TEST"}).name).toEqual("TEST");
                done();
            })();
    });

    it("retrieve object from database", (done) => {
        inject([Http, AuthService, DatastoresService],
            (http:Http, auth:AuthService) => {
                let dss = new DatastoresService();
                let ds = new Datastore<Dao>(
                    {objectUrl: "api/heroes/{id}", listUrl: "api/heroes"},
                    Dao, dss, http, auth);
                spyOn(http, "get").and.callThrough();
                return ds.get({id: 1}).subscribe((value) => {
                    expect(http.get).toHaveBeenCalled();
                    expect(value.name).toEqual("Windstorm");
                    done();
                });
            })();
    });

    it("retrieve object from database then use cache", (done) => {
        inject([Http, AuthService, DatastoresService],
            (http:Http, auth:AuthService, dss:DatastoresService) => {
                let ds = new Datastore<Dao>(
                    {objectUrl: "api/heroes/{id}", listUrl: "api/heroes"},
                    Dao, dss, http, auth);
                spyOn(http, "get").and.callThrough();
                let i = 0;
                return ds.get({id: 1}).subscribe((value) => {
                    if (i === 0) {
                        expect(http.get).toHaveBeenCalledTimes(1);
                        expect(value.name).toEqual("Windstorm");
                        i += 1;
                        ds.get({id: 1});
                    } else {
                        expect(http.get).toHaveBeenCalledTimes(1);
                        expect(value.name).toEqual("Windstorm");
                        done();
                    }
                });
            })();
    });

});
