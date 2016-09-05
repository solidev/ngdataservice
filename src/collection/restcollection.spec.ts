import {expect} from "chai";
import {BaseRequestOptions, Http, Response, RequestMethod, ResponseOptions} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing/mock_backend";
import {REST_BACKEND_CONFIG, DSRestBackend} from "../backends/rest";
import {DSJsonRenderer} from "../renderers/json";
import {DSJsonParser} from "../parsers/json";
import {TestBed, inject} from "@angular/core/testing";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {DSMemoryPersistence} from "../persistence/memory";
import {DSDefaultSerializer} from "../serializers/default";
import {DSTokenAuthentication} from "../authentication/tokenauth";
import {DSRestCollectionSetup, DSRestCollection} from "./restcollection";
import {DSFlatRestUrlAdapterProvider} from "../adapters/flatresturl";
import {DSModel} from "../model/model";
import {DSDummySorterProvider} from "../sorters/dummy";
import {DSDummyFilterProvider} from "../filters/dummy";
import {DSDummyPaginatorProvider} from "../paginators/dummy";
import {IDSModelConstructor} from "../model/interface";

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());


export class TrainCollection extends DSRestCollection<DSModel> {
    public adapter_config: any = {basePath: "/api/trains"};
    public model: IDSModelConstructor<DSModel> = DSModel;

    constructor(public setup: DSRestCollectionSetup) {
        super(setup);
    }

}

describe("DSRestCollection", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => {
                        return new Http(backend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                DSJsonParser,
                DSJsonRenderer,
                {
                    provide: REST_BACKEND_CONFIG,
                    useValue: {host: "example.com", port: 8123, scheme: "https"}
                },
                DSRestBackend,
                DSTokenAuthentication,
                DSDefaultSerializer,
                DSMemoryPersistence,
                DSDummyPaginatorProvider,
                DSDummyFilterProvider,
                DSDummySorterProvider,
                DSFlatRestUrlAdapterProvider,
                DSRestCollectionSetup
            ]
        });
    });

    it("should get an item, store it in persistence and return the result", (done) => {
        let connection: MockConnection;
        inject([MockBackend, DSRestCollectionSetup, DSMemoryPersistence],
            (mock: MockBackend, setup: DSRestCollectionSetup, persistence: DSMemoryPersistence) => {
                mock.connections.subscribe((c) => {
                    connection = c;
                    expect(RequestMethod[connection.request.method]).to.equal("Get");
                    expect(connection.request.url).to.equal("https://example.com:8123/api/trains/1");
                    connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify({id: 1, name: "train"})
                        }))
                    );
                });
                let coll = new TrainCollection(setup);
                coll.get(1).subscribe((result) => {
                    expect(result).to.have.property("id").and.to.equal(1);
                    expect(persistence.list()).to.have.lengthOf(1);
                    done();
                }, (error) => {
                    expect(false).to.be.true;
                    done();
                });
            })();
    });

    it("should get a list of items", (done) => {
        let connection: MockConnection;
        console.log("Before");
        inject([MockBackend, DSRestCollectionSetup, DSMemoryPersistence],
            (mock: MockBackend, setup: DSRestCollectionSetup, persistence: DSMemoryPersistence) => {
                console.log("Steup", setup);
                mock.connections.subscribe((c) => {
                    connection = c;
                    expect(RequestMethod[connection.request.method]).to.equal("Get");
                    expect(connection.request.url).to.equal("https://example.com:8123/api/trains");
                    connection.mockRespond(
                        new Response(new ResponseOptions({
                            body: JSON.stringify([{id: 1, name: "train1"}, {id: 2, name: "train2"}])
                        }))
                    );
                });
                let coll = new TrainCollection(setup);
                coll.list({}).subscribe((result) => {
                    console.log("Result", result);
                    expect(result).to.have.property("items").to.have.lengthOf(2);
                    expect(result).to.have.property("pagination");
                    expect(persistence.list()).to.have.lengthOf(2);
                    done();
                }, (error) => {
                    done(error);
                });
            })();
    });
});

