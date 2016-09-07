import {
    IDSCollection, IDSCollectionSetup, IDSCollectionConstructor,
    COLLECTION_SETUP_NAMES
} from "../collection/interface";
import {IDSModel, IDSModelConstructor} from "../model/interface";
import {DSCollection} from "../collection/collection";
import * as _ from "lodash";
import {IDSAdapter, IDSAdapterProvider} from "../adapters/interface";
import {IDSBackend, IDSBackendProvider} from "../backends/interface";
import {IDSAuthentication, IDSAuthenticationProvider} from "../authentication/interface";
import {IDSSerializer, IDSSerializerProvider} from "../serializers/interface";
import {IDSPersistence, IDSPersistenceProvider} from "../persistence/interface";
import {IDSPaginator, IDSPaginatorProvider} from "../paginators/interface";

export class DSService<T extends IDSModel> implements IDSCollectionSetup {
    public collection: IDSCollectionConstructor<T>;
    public model: IDSModelConstructor<T>;
    public setup: IDSCollectionSetup;

    public adapter: IDSAdapter;
    public adapter_provider: IDSAdapterProvider;
    public adapter_config: any;
    public backend: IDSBackend;
    public backend_provider: IDSBackendProvider;
    public backend_config: any;
    public authentication: IDSAuthentication;
    public authentication_provider: IDSAuthenticationProvider;
    public authentication_config: any;
    public serializer: IDSSerializer;
    public serializer_provider: IDSSerializerProvider;
    public serializer_config: any;
    public persistence: IDSPersistence;
    public persistence_provider: IDSPersistenceProvider;
    public persistence_config: any;
    public paginator: IDSPaginator;
    public paginator_provider: IDSPaginatorProvider;
    public paginator_config: any;


    public getCollection(context: any = {}): IDSCollection<T> {
        let collection: IDSCollection<T>;
        if (this.collection) {
            collection = new this.collection(this.getSetup(), context);
        }
        collection = new DSCollection<T>(this.getSetup(), context);
        if (this.model) {
            collection.model = this.model;
        }
        return collection;
    }

    public getSetup(): IDSCollectionSetup {
        let setup = {};
        _.defaults(setup, _.pick(<any>this, COLLECTION_SETUP_NAMES), this.setup);
        return setup;
    }
}
