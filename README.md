[![build status](https://gitlab.com/solidev/ngdatastore/badges/develop/build.svg)](https://gitlab.com/solidev/ng2datastore/commits/develop)
[![coverage report](https://gitlab.com/solidev/ngdatastore/badges/develop/coverage.svg)](https://gitlab.com/solidev/ngdatastore/commits/develop)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Sauce Test Status](https://saucelabs.com/buildstatus/solidev)](https://saucelabs.com/u/solidev)
[![Dependency Status](https://www.versioneye.com/user/projects/5824f7a8613b6801f3f430fc/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/5824f7a8613b6801f3f430fc)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/solidev.svg)](https://saucelabs.com/u/solidev)


**This is a Work In Progress project - do not use it until it reaches at least `0.1`**

# ngdatastore : data access for angular2+
This project is hosted on https://gitlab.com/solidev/ngdatastore
Issues, builds and pull(merge) requests are on gitlab side, github
repository is read-only.

## Installation

Tested with **angular@2.4.5** / AOT enabled : ```npm install ngdatastore --save```

## Usage

With webpack : as is (see [example](./example/simple.webpack/src/app/app.component.ts));
with systemjs : (see [example](./example/simple.system/config.js))
```
map: { ... "ngdatastore": "./node_modules/ngdatastore",  ... },
packages: { "ngdatastore": { main: "index.js", defaultExtension: 'js' } ... }
```

No umd bundles are provided.

## Example : default REST backend

This example uses the default REST setup :

- REST api backend (GET/POST/PUT/PATCH/DELETE)
- flat url adapter : urls in `http://apiurl/item/{id}` form
- persistence backend : shared memory cache for objects
- default serializer : removes all _ and $ prefixed properties of models
- renderer and parser : json content-type, not wrapped
- no pagination for list results

### Models declaration

```typescript
// file models/train.service.ts
// ----------------------------
import {DSModel, DSCollection, DSRestCollectionSetup} from "ngdatastore";
import {Injectable} from "@angular/core";

// Model declaration
export class Train extends DSModel {
    // Model fields
    public id: number;
    public title: string;
    // Model methods
    public honk(): void {
        console.log(`${this.title} is honking`);
    }
}

// Train collections provider
@Injectable()
export class TrainService extends DSCollection<Train> {
    public adapter_config = {basePath: "/trains"};
    public model = Train;
    // Needed to inject default settings
    constructor(public setup: DSRestCollectionSetup) {
        super(setup);
    }
}

```

### Module and providers

```typescript
// file app.module.ts
// ------------------
import {NgModule} from "@angular/core";

// import Rest module and config providers
import {RestModule, REST_ADAPTER_CONFIG} from "ngdatastore";

import {TrainService} from "models/train.service";

@NgModule({
    imports: [BrowserModule, RestModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        // providing backend config
        {provide: REST_BACKEND_CONFIG, useValue: {url: "https://example.com/api/v1"}},
        // our train service
        TrainService]
})
export class AppModule {
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
    `;
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

