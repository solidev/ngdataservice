import {DSModel} from "lib/model/model";
import {DSCollection} from "lib/collection/collection";
import {Injectable} from "@angular/core";
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

}

@Injectable()
export class TrainService extends DSRestDataService<Train> {
    constructor(
        public backend: DSRestBackend,
        public serializer: DSDefaultSerializer,
        public adapter: DSRestUrlAdapter,
        public persistence: DSMemoryPersistence,
        public registry: DSRegister
    ) {
        super(backend, serializer, adapter, persistence, registry);
    }
}