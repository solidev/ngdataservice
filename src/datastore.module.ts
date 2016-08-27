import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {DSRestBackend, DSRestBackendProvider} from "./backends/rest";
import {DSRestDataService} from "./service/service";
import {DSDefaultSerializer, DSDefaultSerializerProvider} from "./serializers/default";
import {DSFlatRestUrlAdapter, DSFlatRestUrlAdapterProvider} from "./adapters/flatresturl";
import {DSRegister} from "./register/register";
import {DSMemoryPersistence, DSMemoryPersistenceProvider} from "./persistence/memory";
import {DSJsonParser, DSJsonParserProvider} from "./parsers/json";
import {DSJsonRenderer, DSJsonRendererProvider} from "./renderers/json";
import {DSPagePaginator, DSPagePaginatorProvider} from "./paginators/pages";
import {DSTokenAuthenticationProvider, DSTokenAuthentication} from "./authentication/tokenauth";

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        DSRestBackend,
        DSRestDataService,
        DSDefaultSerializer,
        DSFlatRestUrlAdapter,
        DSRegister,
        DSMemoryPersistence,
        DSTokenAuthentication,
        DSPagePaginator,
        DSJsonParser,
        DSJsonRenderer,
        DSRestBackendProvider,
        DSDefaultSerializerProvider,
        DSFlatRestUrlAdapterProvider,
        DSMemoryPersistenceProvider,
        DSJsonParserProvider,
        DSJsonRendererProvider,
        DSPagePaginatorProvider,
        DSTokenAuthenticationProvider

    ],
    exports: []
})
export class RestModule {
}