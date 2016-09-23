import {IDSModel} from "../model/interface";
import {IDSCollection, IDSCollectionGetParams, IDSModelList} from "../collection/interface";
import {IDSPaginator, IDSPaginatorProvider, IDSPaginatorClass} from "../paginators/interface";
import {IDSQueryset} from "./interface";
import {IDSFilter, IDSFilterClass, IDSFilterProvider} from "../filters/interface";
import {IDSSorter, IDSSorterClass, IDSSorterProvider} from "../sorters/interface";
import {Observable, ReplaySubject} from "rxjs";
import {DSConfiguration} from "../collection/configuration";
import * as _ from "lodash";

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
        this.setup = _.defaults(this.setup, collection.setup || {});
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
                    this.sorter.localSorter
                )
            );
        } else {
            let search = this.collection.adapter.search(this.filter.backendFilter);
            console.log("Search", search);
            this.collection.backend.list(search, {})
                .subscribe((result) => {
                    let pagination = this.paginator.getPaginationInfos(result);
                    let items = this.paginator.getResults(result);
                    let _items = [];
                    for (let item of items) {
                        let itemdata = this.collection.serializer.deserialize(item);
                        console.log("Data", itemdata);
                        let temp = new this.collection.model(this.collection, itemdata);
                        console.log("Temp", temp);
                        let identifier = this.collection.adapter.identifier(temp);
                        let instance = this.collection.persistence.retrieve(identifier);
                        if (instance) {
                            instance.assign(itemdata);
                            this.collection.persistence.save(identifier, instance);
                            console.log("Instance", instance);
                            _items.push(instance);
                        } else {
                            console.log("Temp", temp);
                            this.collection.persistence.save(identifier, temp);
                            _items.push(temp);
                        }
                        console.log("Item", item);
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