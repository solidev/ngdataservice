import { expect } from "chai";
import {
    DSRestBackend, DSRestBackendSetup, REST_BACKEND_AUTHENTICATION, REST_BACKEND_CONFIG,
    REST_BACKEND_RENDERER
} from "../backends/rest";
import { inject, TestBed } from "@angular/core/testing";
import { DSMemoryPersistence } from "../persistence/memory";
import { DSDefaultSerializer } from "../serializers/default";
import { DSRestCollection, DSRestCollectionSetup } from "./restcollection";
import { DSRestUrlAdapterProvider } from "../adapters/resturl";
import { DSModel } from "../model/model";
import { DSDummySorterProvider } from "../sorters/dummy";
import { DSDummyFilterProvider } from "../filters/dummy";
import { DSDummyPaginatorProvider } from "../paginators/dummy";
import { IDSModelClass } from "../model/interface";
import { DSMockRestApi, MOCK_REST_API_PROVIDER } from "../testing/mockrestapi";
import "rxjs/observable/of";
import "rxjs/operator/mergeMap";
import { DSJsonParser } from "../parsers/json";
import { DSJsonRenderer } from "../renderers/json";
import { DSRestAuthentication, REST_BACKEND_PARSER } from "../ngdataservice";


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
                DSRestAuthentication,
                DSRestBackendSetup,
                {
                    provide: REST_BACKEND_CONFIG,
                    useValue: {host: "example.com", port: 8123, scheme: "https"}
                },
                {provide: REST_BACKEND_PARSER, useClass: DSJsonParser},
                {provide: REST_BACKEND_RENDERER, useClass: DSJsonRenderer},
                {provide: REST_BACKEND_AUTHENTICATION, useClass: DSRestAuthentication},
                DSRestBackendSetup,
                DSRestBackend,
                DSDefaultSerializer,
                DSMemoryPersistence,
                DSDummyPaginatorProvider,
                DSDummyFilterProvider,
                DSDummySorterProvider,
                DSRestUrlAdapterProvider,
                DSRestCollectionSetup,
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

