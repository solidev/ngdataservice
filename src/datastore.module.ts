import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {DSRestBackend, DSRestBackendProvider} from "./backends/rest";
import {DSDefaultSerializer, DSDefaultSerializerProvider} from "./serializers/default";
import {DSFlatRestUrlAdapter, DSFlatRestUrlAdapterProvider} from "./adapters/flatresturl";
import {DSRegister} from "./register/register";
import {DSMemoryPersistence, DSMemoryPersistenceProvider} from "./persistence/memory";
import {DSJsonParser, DSJsonParserProvider} from "./parsers/json";
import {DSJsonRenderer, DSJsonRendererProvider} from "./renderers/json";
import {DSPagePaginator, DSPagePaginatorProvider} from "./paginators/pages";
import {DSTokenAuthenticationProvider, DSTokenAuthentication} from "./authentication/tokenauth";
import {DSRestCollectionSetup} from "./collection/restcollection";
import {DSDummyPaginator, DSDummyPaginatorProvider} from "./paginators/dummy";
import {DSDummySorter, DSDummySorterProvider} from "./sorters/dummy";
import {DS_FILTERS, DS_FILTER_PROVIDERS} from "./filters/index";

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        DSRestBackend,
        DSDefaultSerializer,
        DSFlatRestUrlAdapter,
        DSRegister,
        DSMemoryPersistence,
        DSTokenAuthentication,
        DSPagePaginator,
        DSDummyPaginator,
        DSDummySorter,
        DS_FILTERS,
        DSJsonParser,
        DSJsonRenderer,
        DSRestBackendProvider,
        DSDefaultSerializerProvider,
        DSFlatRestUrlAdapterProvider,
        DSMemoryPersistenceProvider,
        DSJsonParserProvider,
        DSJsonRendererProvider,
        DSPagePaginatorProvider,
        DSTokenAuthenticationProvider,
        DSDummyPaginatorProvider,
        DSDummySorterProvider,
        DS_FILTER_PROVIDERS,
        DSRestCollectionSetup
    ]
})
export class RestModule {
}
