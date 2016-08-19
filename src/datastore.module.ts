import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {DSRestBackend} from "./backends/rest";
import {DSRestDataService} from "./service/service";
import {DSDefaultSerializer} from "./serializers/default";
import {DSRestUrlAdapter} from "./adapters/resturl";
import {DSRegister} from "./register/register";
import {DSMemoryPersistence} from "./persistence/memory";
import {DSJsonParser} from "./parsers/json";
import {DSJsonRenderer} from "./renderers/json";

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        DSRestBackend,
        DSRestDataService,
        DSDefaultSerializer,
        DSRestUrlAdapter,
        DSRegister,
        DSMemoryPersistence,
        DSJsonParser,
        DSJsonRenderer
    ],
    exports: []
})
export class RestModule {
}