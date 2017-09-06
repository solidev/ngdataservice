[![build status](https://dev.solidev.net/solidev/ngdataservice/badges/develop/build.svg)](https://dev.solidev.net/solidev/ngdataservice/commits/develop)
[![coverage report](https://dev.solidev.net/solidev/ngdataservice/badges/develop/coverage.svg)](https://dev.solidev.net/solidev/ngdataservice/commits/develop)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Dependency Status](https://www.versioneye.com/user/projects/59afb398368b080014d24ba5/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/59afb398368b080014d24ba5)
<!--[![Sauce Test Status](https://saucelabs.com/buildstatus/solidev)](https://saucelabs.com/u/solidev)-->
<!--
[![Sauce Test Status](https://saucelabs.com/browser-matrix/solidev.svg)](https://saucelabs.com/u/solidev)

[![Build Status](https://saucelabs.com/browser-matrix/ngdatastore.svg)](https://saucelabs.com/beta/builds/ff5dc073fc624478bd5f648eda45033d)
-->
**This is a Work In Progress project, api is not yet fully stabilized**

Tested with **angular@4.x.x**. AOT ready.

This project is hosted on gitlab : https://dev.solidev.net/solidev/ngdataservice and mirrored to github. Issues,
builds and pull(merge) requests are on gitlab side, for now
github repository is read-only.

# ngdataservice : data access for angular4+

Ngdataservice provides collections and models behaviour (create, save,
update, delete, search, ...).

## Installation

```npm install ngdataservice --save``` or ```yarn add ngdataservice```

## Usage

- with webpack : see [example](./example/simple.webpack/src/app/app.component.ts));
- with systemjs : see [example](./example/simple.system/config.js))

    ```
    map: { ... "ngdataservice": "./node_modules/ngdataservice",  ... },
    packages: { "ngdataservice": { main: "index.js", defaultExtension: 'js' } ... }
    ```

No umd bundles provided.

## Example with REST backend

This example uses the default REST setup :

- REST api backend (GET/POST/PUT/PATCH/DELETE)
- flat url adapter : urls in `http://apiurl/item/{id}` form
- persistence backend : shared memory cache for objects
- default serializer : removes all _ and $ prefixed properties of
  models
- renderer and parser : json content-type, not wrapped
- no pagination for list results

### Models and collection declaration
#### Model declaration

Models are the base blocks. Model declaration must provide model fields,
and custom properties if needed. The common model behaviour (save,
create, ...) is inherited from `DSModel`.

```typescript
// file models/train.model.ts

import {DSModel} from "ngdataservice";
import {Injectable} from "@angular/core";

// Model declaration
export class Train extends DSModel {
    
    // Model fields
    id: number;
    title: string;
    
    // Custom model methods
    honk() {
        console.log(`${this.title} is honking`);
    }
}
```

#### Collection declaration

Collections are the bridge between models and database. They provide
CRUD operations from `DSCollection` inheritance.

```typescript
// file collections/train.collection.ts
import {DSCollection, REST_COLLECTION_SETUP} from "ngdataservice";
import {Injectable} from "@angular/core";
import {Train} from "../models/train.model";

// Train collections provider
@Injectable()
export class TrainService extends DSCollection<Train> {
    
    // Associated model
    model = Train;
        
    // Custom setup values
    adapter_config = {basePath: "/trains"};
    
    // Needed to inject default settings
    constructor(public setup: REST_COLLECTION_SETUP) {
        super(setup);
    }
}

```

All default collection parameters are provided through `DSRestCollectionSetup`,
and custom parameters are given as collection properties.

### Module and providers

Global parameters for collections can be setup at module level, and
then used through dependency injection.

```typescript
// file data.module.ts
// ------------------

// import Rest module and config providers
import {RestModule, REST_BACKEND_CONFIG} from "ngdataservice";

import {NgModule, CommonModule} from "@angular/core";


import {TrainService} from "models/train.service";

@NgModule({
    imports: [CommonModule, RestModule],
    providers: [
        // providing some global config
        {provide: REST_BACKEND_CONFIG, useValue: {url: "https://example.com/api/v1"}},
        // our train service
        TrainService]
})
export class DataModule {
}
```

### Usage

- inject `TrainService`
- use directly `TrainService` to retrieve, create, update, delete model
  instances
- use `queryset` to list, filter, paginate results

```typescript
import {Component} from "@angular/core";
import {Train, TrainService} from "models/train.service";

@Component({
    selector: "my-train",
    template: `
    <h1>My train</h1>
    <div>{{train?.id}} {{train?.title}}</div>
    <ul>
        <li><a (click)="retrieveAction()">Retrieve</a></li>
        <li>...</li>
    </ul>
    `
})
export class TrainComponent {
    public train: Train;
    public trains: Train[];

    constructor(private _trains: TrainService) {
    }

    public retrieveAction(): void {
        this._trains.get(1)
            .subscribe((t) => {
                console.log("Got train", t);
                this.train = t;
            })
    }

    public saveAction(): void {
        this.train.title = "Chugginton";
        this.train.save()
            .subscribe((t) => {
                console.log("Saved train", t, this.train);
            });
    }

    public createAction(): void {
        this._trains.save({title: "New train"})
            .subscribe((t) => {
                console.log("Created (but not saved) train", t);
                this.train = t;
            })
     }

    public createAndSaveAction(): void {
        this._trains.save({title: "New train"}, {create: true})
            .subscribe((t) => {
                console.log("Created and saved train", t);
                this.train = t;
            })

    }

    public getFromCacheAction(): void {
        this._trains.get(1, {fromcache: true})
            .subscribe((t) => {
                console.log("Got train without API call", t);
                this.train = t;
            })
    }

    public removeAction(): void {
        this._trains.remove()
            .subscribe(() => {
                console.log("Deleted train 1);
            })
    }

    public searchAction(): void {
        this._trains.queryset
            .filter({name: "chugginton"})
            .sort(["+name", "-id"])
            .paginate({page: 1, perpage: 10})
            .get()
            .subscribe((paginated) => {
                console.log("Pagination infos", paginated.pagination);
                this.trains = paginated.items;
            });
    }

}
```

[Get it in action](https://plunkr.com/xxxx) (TODO)

## API

### Model API

[Details : see model](./src/model/README.md)

- **`.save(): Observable(model)`**
- **`.update(fields: string[]): Observable(model)`**
- **`.remove(): Observable(any)`**
- **`.refresh(): Observable(model)`**
- **`.assign(data, options): DSValidationResult`**
    - `options.validate: true|false`
    - `options.async: true|false`)
- **`.validate(options): DSValidationResult`**
    - `options.async = true|false`
- **`.dirty()`: string[]**

### Collection API

[Details : see collection](./src/collection/README.md)

- **`constructor(setup, context)`**
- **`init()`**

Model instance operations :

- **`save(values, options): Observable(model)`**
    - `options.validation = true|*false*|"sync"`
    - `options.save = true|*false*`
    - `options.volatile = true|*false*`
- **`save(model): Observable(model)`**
- **`update(model, fields): Observable(model)`**
- **`remove(model): Observable(any)`**
- **`refresh(model)`**
- **`get(pk, params): Observable(model)`**
    - `params.fromcache = true|*false*`
    - `params.dual = true|*false*`

Queryset :

- **`queryset`** : return a new queryset instance.


### Queryset API

TODO

### Register API

TODO

## Stack

TODO: drawing

### Backend

[See backend](./src/backends/README.md)

### Parser / renderer

[See parser](./src/parsers/README.md)

[See renderer](./src/renderers/README.md)


### Serializer

[See serializer](./src/serializers/README.md)

### Adapter

[See adapter](./src/adapters/README.md)

### Persistence

[See persistence](./src/persistence/README.md)


### Paginator

TODO

### Filters

TODO

