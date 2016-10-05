import {IDSModel} from "../model/interface";
import {IDSCollection, IDSCollectionGetParams, IDSModelList, COLLECTION_SETUP_NAMES} from "../collection/interface";
import {IDSPaginator, IDSPaginatorProvider, IDSPaginatorClass} from "../paginators/interface";
import {IDSQueryset} from "./interface";
import {IDSFilter, IDSFilterClass, IDSFilterProvider} from "../filters/interface";
import {IDSSorter, IDSSorterClass, IDSSorterProvider} from "../sorters/interface";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {DSConfiguration} from "../collection/configuration";
import * as defaults from "lodash/defaults";
import * as pick from "lodash/pick";
import {IDSAdapterSearchParams} from "../adapters/interface";

export class DSQueryset<T extends IDSModel> extends DSConfiguration implements IDSQueryset<T> {

    public results: Observable<IDSModelList<T>>;

    public paginator_class: IDSPaginatorClass;
    public paginator_provider: IDSPaginatorProvider;
    public paginator_config: any;

    public filter_class: IDSFilterClass;
    public filter_provider: IDSFilterProvider;
    public filter_config: any;

    public sorter_class: IDSSorterClass;
    public sorter_provider: IDSSorterProvider;
    public sorter_config: any;

    private _results: ReplaySubject<IDSModelList<T>> = new ReplaySubject<IDSModelList<T>>(1);
    /* tslint:disable:no-unused-variable */
    private _paginator: IDSPaginator;
    private _filter: IDSFilter;
    private _sorter: IDSSorter;
    /* tslint: enable */


    constructor(public collection: IDSCollection<T>) {
        super();
        // Setup is created from 1) this.setup, 2) collection properties 3) collection setup values
        this.setup = defaults(
            this.setup,
            pick(<any>collection, COLLECTION_SETUP_NAMES),
            collection.setup || {});
        this.results = this._results.asObservable();
    }

    public all(params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        return this.get(params);
    }

    public paginate(): IDSQueryset<T> {
        return this;
    }

    public sort(params: any): IDSQueryset<T> {
        this.sorter.update(params);
        return this;
    }

    public query(params: any): IDSQueryset<T> {
        this.filter.update(params);
        return this;
    }

    public get(params: IDSCollectionGetParams = {}): Observable<IDSModelList<T>> {
        if (params.fromcache) {
            return Observable.of(
                this.collection.persistence.list(
                    this.filter.localFilter,
                    this.sorter.localSorter,
                    {context: this.collection.context}
                )
            );
        } else {
            let searchArgs: IDSAdapterSearchParams = {
                filter: this.filter.backendFilter,
                context: this.collection.context
            };
            let search = this.collection.adapter.search(searchArgs);
            console.log("Search", search);
            this.collection.backend.list(search, {context: this.collection.context})
                .subscribe((result) => {
                    let pagination = this.paginator.getPaginationInfos(result, {context: this.collection.context});
                    let items = this.paginator.getResults(result, {context: this.collection.context});
                    let _items = [];
                    for (let item of items) {
                        let itemdata = this.collection.serializer.deserialize(item, {context: this.collection.context});
                        let temp = new this.collection.model(this.collection, itemdata);
                        let identifier = this.collection.adapter.identifier(temp, {context: this.collection.context});
                        let instance = this.collection.persistence.retrieve(
                            identifier,
                            {context: this.collection.context}
                        );
                        if (instance) {
                            instance.assign(itemdata);
                            this.collection.persistence.save(identifier, instance, {context: this.collection.context});
                            _items.push(instance);
                        } else {
                            this.collection.persistence.save(identifier, temp, {context: this.collection.context});
                            _items.push(temp);
                        }
                    }
                    // TODO: save persistence of results ids ?
                    let output = {items: _items, pagination: pagination};
                    this._results.next(output);
                });
            return this.results;
        }
    }

    public get filter(): IDSFilter {
        return <IDSFilter>this.get_service("filter", this.get_filter_config());
    }

    protected get_filter_config(): any {
        return this.get_service_config("filter");
    }

    public get sorter(): IDSSorter {
        return <IDSSorter>this.get_service("sorter", this.get_sorter_config());
    }

    protected get_sorter_config(): any {
        return this.get_service_config("sorter");
    }

    public get paginator(): IDSPaginator {
        return <IDSPaginator>this.get_service("paginator", this.get_paginator_config());
    }

    protected get_paginator_config(): any {
        return this.get_service_config("paginator");
    }
}
