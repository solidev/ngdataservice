import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import {
    DSRestBackend, DSRestBackendProvider, DSRestBackendSetup, REST_BACKEND_AUTHENTICATION,
    REST_BACKEND_PARSER, REST_BACKEND_RENDERER
} from "./backends/rest";
import { DSDefaultSerializer, DSDefaultSerializerProvider } from "./serializers/default";
import { DSRestUrlAdapter, DSRestUrlAdapterProvider } from "./adapters/resturl";
import { DSRegister } from "./register/register";
import { DSMemoryPersistence, DSMemoryPersistenceProvider } from "./persistence/memory";
import { DSJsonParser, DSJsonParserProvider } from "./parsers/json";
import { DSJsonRenderer, DSJsonRendererProvider } from "./renderers/json";
import { DSPagePaginator, DSPagePaginatorProvider } from "./paginators/pages";
import { DSRestAuthentication, DSTokenAuthentication, DSTokenAuthenticationProvider } from "./authentication/tokenauth";
import { DSRestCollectionSetup } from "./collection/restcollection";
import { DSDummyPaginator, DSDummyPaginatorProvider } from "./paginators/dummy";
import { DSDummySorter, DSDummySorterProvider } from "./sorters/dummy";
import { DS_FILTER_PROVIDERS, DS_FILTERS } from "./filters/index";

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        DSRestBackend,
        {provide: REST_BACKEND_PARSER, useClass: DSJsonParser},
        {provide: REST_BACKEND_RENDERER, useClass: DSJsonRenderer},
        {provide: REST_BACKEND_AUTHENTICATION, useClass: DSRestAuthentication},

        DSDefaultSerializer,
        DSRestUrlAdapter,
        DSRegister,
        DSMemoryPersistence,
        DSTokenAuthentication,
        DSRestAuthentication,
        DSPagePaginator,
        DSDummyPaginator,
        DSDummySorter,
        DS_FILTERS,
        DSJsonParser,
        DSJsonRenderer,
        DSRestBackendProvider,
        DSDefaultSerializerProvider,
        DSRestUrlAdapterProvider,
        DSMemoryPersistenceProvider,
        DSJsonParserProvider,
        DSJsonRendererProvider,
        DSPagePaginatorProvider,
        DSTokenAuthenticationProvider,
        DSDummyPaginatorProvider,
        DSDummySorterProvider,
        DS_FILTER_PROVIDERS,
        DSRestCollectionSetup,
        DSRestBackendSetup
    ]
})
export class RestModule {
}
