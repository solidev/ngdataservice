import {expect} from "chai";
import {Response, RequestMethod, ResponseOptions} from "@angular/http";
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
import {DSFlatRestUrlAdapterProvider} from "../adapters/resturl";
import {DSModel} from "../model/model";
import {DSDummySorterProvider} from "../sorters/dummy";
import {DSDummyFilterProvider} from "../filters/dummy";
import {DSDummyPaginatorProvider} from "../paginators/dummy";
import {IDSModelClass} from "../model/interface";
import {MOCK_REST_API_PROVIDER, DSMockRestApi} from "../testing/mockrestapi";

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());


export class TrainCollection extends DSRestCollection<DSModel> {
    public adapter_config: any = {basePath: "/api/trains"};
    public model: IDSModelClass<DSModel> = DSModel;

    constructor(public setup: DSRestCollectionSetup) {
        super(setup);
    }

}

describe("DSRestCollection", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MOCK_REST_API_PROVIDER,
                DSMockRestApi,
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
        inject([DSMockRestApi, DSRestCollectionSetup, DSMemoryPersistence],
            (api: DSMockRestApi, setup: DSRestCollectionSetup, persistence: DSMemoryPersistence) => {
                api.addResponse({
                    url: "https://example.com:8123/api/trains/1",
                    body: {id: 1, name: "train"},
                    order: true
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
        inject([DSMockRestApi, DSRestCollectionSetup, DSMemoryPersistence],
            (api: DSMockRestApi, setup: DSRestCollectionSetup, persistence: DSMemoryPersistence) => {
                api.addResponse({
                    url: "https://example.com:8123/api/trains",
                    body: [{id: 1, name: "train1"}, {id: 2, name: "train2"}],
                    order: true
                });
                let coll = new TrainCollection(setup);
                coll.queryset.all().subscribe((result) => {
                    expect(result).to.have.property("items").to.have.lengthOf(2);
                    expect(result).to.have.property("pagination");
                    expect(persistence.list()).to.have.lengthOf(2);
                    done();
                }, (error) => {
                    expect(false).to.be.true;
                    done();
                });
            })();
    });
});

