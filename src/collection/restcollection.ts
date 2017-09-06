import { DSCollection } from "./collection";
import { IDSModel } from "../model/interface";
import { DSRestUrlAdapterProvider } from "../adapters/resturl";
import { DSRestBackend } from "../backends/rest";
import { DSDefaultSerializer } from "../serializers/default";
import { DSMemoryPersistence } from "../persistence/memory";
import { DSRestAuthentication } from "../authentication/tokenauth";
import { Injectable, Optional } from "@angular/core";
import { IDSCollectionContext, IDSCollectionSetup } from "./interface";
import { DSDummyFilterProvider } from "../filters/dummy";
import { DSDummySorterProvider } from "../sorters/dummy";
import { DSDummyPaginatorProvider } from "../paginators/dummy";

@Injectable()
export class DSRestCollectionSetup implements IDSCollectionSetup {
    public constructor(public adapter_provider: DSRestUrlAdapterProvider,
                       public backend: DSRestBackend,
                       public serializer: DSDefaultSerializer,
                       public persistence: DSMemoryPersistence,
                       public paginator_provider: DSDummyPaginatorProvider,
                       public filter_provider: DSDummyFilterProvider,
                       public sorter_provider: DSDummySorterProvider) {
    }
}


@Injectable()
export class DSRestCollection<T extends IDSModel> extends DSCollection<T> {

    constructor(@Optional() setup: DSRestCollectionSetup, @Optional() context: IDSCollectionContext = {}) {
        super(setup, context);
    }
}

