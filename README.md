[![build status](https://gitlab.com/solidev/ng2datastore/badges/develop/build.svg)](https://gitlab.com/solidev/ng2datastore/commits/develop)
[![coverage report](https://gitlab.com/solidev/ng2datastore/badges/develop/coverage.svg)](https://gitlab.com/solidev/ng2datastore/commits/develop)

# ng2datastore : data access for angular2
This project is hosted on https://gitlab.com/solidev/ng2datastore
Issues, builds and pull(merge) requests are on gitlab side, github
repository is read-only.

## Installation

Works with **angular@2.0.0-rc.6** : ```npm install ng2datastore --save```

## Usage

With webpack : as is (see [./example/simple.webpack/](example)); with systemjs : (see [./example/simple.system/](system))
```
map: { ... "ng2datastore": "./node_modules/ng2datastore",  ... },
packages: { "ng2datastore": { main: "index.js", defaultExtension: 'js' } ... }
```    

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
import {DSModel, DSService, DSRestCollectionSetup} from "ng2datastore";
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
export class TrainService extends DSService<Train> {
    public adapter_config = {basePath: "/trains"};
    public model = Train;
    // Needed to inject default settings
    constructor(public setup: DSRestCollectionSetup) {
        super();
    }
}

```

### Module and providers

```typescript
// file app.module.ts
import {NgModule} from "@angular/core";
import {RestModule, REST_ADAPTER_CONFIG,
    DSRestCollectionSetup} from "ng2datastore";
import {TrainService} from "models/train.service";

@NgModule({
    imports: [BrowserModule, RestModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        // providing backend config
        {provide: REST_BACKEND_CONFIG, useValue: {url: "https://example.com/api/v1"}},
        // provide default setup
        DSRestCollectionSetup,
        // our train service
        TrainService]
})
export class AppModule {
}
``` 

### Usage in component

- inject TrainService
- get a new collection via `.getCollection()`
- retrieve, create, update, delete model instances

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
    private _trains;
    
    constructor(TrainService: TrainService) {
        this._trains = TrainService.getCollection();    
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
        this._trains.create({title: "New train"})
            .subscribe((t) => {
                console.log("Created (but not saved) train", t);
                this.train = t;
            })
     }
     
    public createAndSaveAction(): void {
        this._trains.create({title: "New train"}, {create: true})
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
        this.trains.remove()
            .subscribe(() => {
                console.log("Deleted train 1);
            })
    }

}
```

[Get it in action](https://plunkr.com/xxxx) (TODO)

## API

### Model API

[See model](./src/model/README.md)

### Collection API

[See collection](./src/collection/README.md)

### Service API

TODO

### Register API

TODO

## Stack

### Backend

[See backend](./src/backend/README.md)

### Parser / renderer

[See parser](./src/parser/README.md)

[See renderer](./src/renderer/README.md)


### Serializer

[See serializer](./src/serializer/README.md)

### Adapter

[See adapter](./src/adapter/README.md)

### Persistence

[See persistence](./src/persistence/README.md)


### Paginator

TODO

### Filters

TODO

