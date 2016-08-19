import {DSModel} from "lib/model/model";
import {DSCollection} from "lib/collection/collection";
import {Injectable, Optional} from "@angular/core";
import {DSRestDataService} from "lib/service/service";
import {DSRestBackend} from "lib/backends/rest";
import {DSDefaultSerializer} from "lib/serializers/default";
import {DSRestUrlAdapter} from "lib/adapters/resturl";
import {DSRegister} from "lib/register/register";
import {DSMemoryPersistence} from "lib/persistence/memory";

export class Train extends DSModel {
    public id: number = 12;
}

export class TrainCollection extends DSCollection<Train> {
    public PARAMS: any = {
            adapter: {
                baseUrl: "/api/v1/trains"
            },
            persistence: {
                timeout: 3600 * 1000
            }
        };

    protected _serializer:DSDefaultSerializer = new DSDefaultSerializer();
    protected _adapter:DSRestUrlAdapter = new DSRestUrlAdapter({
        basePath: "/api/v1/trains"
    });

}

@Injectable()
export class TrainService extends DSRestDataService<Train> {
    constructor(public backend: DSRestBackend,              // global or semi-global
                public serializer: DSDefaultSerializer,     // generic or semi-local
                public adapter: DSRestUrlAdapter,           // local
                public persistence: DSMemoryPersistence,    // global or semi-global
                public registry: DSRegister                 // global or semi-global
    ) {
        super(backend, serializer, adapter, persistence, registry);
    }
}