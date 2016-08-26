import {DSModel} from "lib/model/model";
import {DSCollection} from "lib/collection/collection";
import {Injectable} from "@angular/core";
import {DSMemoryPersistenceProvider} from "lib/persistence/memory";
import {DSDefaultSerializerProvider} from "lib/serializers/default";
import {DSRestUrlAdapterProvider} from "lib/adapters/resturl";
import {DSRestBackendProvider} from "lib/backends/rest";
import {DSPagePaginatorProvider} from "lib/paginators/pages";
import {DSTokenAuthenticationProvider} from "lib/authentication/tokenauth";

export class Train extends DSModel {
    /* @Field({
     type: DSIntegerField,
     validators: [DSGreaterThanValidator(0)]
     })*/
    public id: number = 12;
    /*@Field({
     type: DSStringField,
     validators: [DSMinLength(5), DSMaxLength(20)]
     })*/
    public name: string = "chugginton";

    public honk(): void {
        console.log(`${this.name} is honking`);
    }
}

@Injectable()
export class TrainCollection extends DSCollection<Train> {
    protected backend_config: any = {url: "https://jsonplaceholder.typicode.com"}
    protected adapter_config: any = {baseUrl: "/api/v1/trains"};
    protected _base = Train;

    constructor(public backend_provider: DSRestBackendProvider,
                public persistence_provider: DSMemoryPersistenceProvider,
                public serializer_provider: DSDefaultSerializerProvider,
                public adapter_provider: DSRestUrlAdapterProvider,
                public paginator_provider: DSPagePaginatorProvider,
                public authentication_provider: DSTokenAuthenticationProvider) {
        super({});
    }

}


