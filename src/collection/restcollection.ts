import {DSCollection} from "./collection";
import {IDSModel} from "../model/interface";
import {DSFlatRestUrlAdapterProvider} from "../adapters/flatresturl";
import {DSRestBackend} from "../backends/rest";
import {DSDefaultSerializer} from "../serializers/default";
import {DSMemoryPersistence} from "../persistence/memory";
import {DSPagePaginator} from "../paginators/pages";
import {DSTokenAuthentication} from "../authentication/tokenauth";
import {Injectable} from "@angular/core";
import {IDSCollectionSetup} from "./interface";

@Injectable()
export class DSRestCollectionSetup implements IDSCollectionSetup {
    public constructor(public adapter_provider: DSFlatRestUrlAdapterProvider,
                       public backend: DSRestBackend,
                       public authentication: DSTokenAuthentication,
                       public serializer: DSDefaultSerializer,
                       public persistence: DSMemoryPersistence,
                       public paginator: DSPagePaginator) {
    }
}


@Injectable()
export class DSRestCollection<T extends IDSModel> extends DSCollection<T> {
}
