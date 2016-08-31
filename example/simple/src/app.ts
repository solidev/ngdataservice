// our root app component
import {Component, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TrainCollection, Train, TrainService} from "./model";
import {RestModule} from "ng2datastore/dist/datastore.module";
import {REST_BACKEND_CONFIG, REST_ADAPTER_CONFIG, DSRestCollectionSetup} from "ng2datastore";


@Component({
    selector: "ds-app",
    template: `
    <div>
      <h2>This is fetched train data</h2>
        <pre>{{train?.title}}</pre>
    </div>
  `
})
export class AppComponent {
    public train: Train;

    constructor(private _trains: TrainService) {
        this._trains.getCollection().get(1).subscribe((t) => {
            console.log("Got train", t);
            this.train = t;
        });
    }
}


@NgModule({
    imports: [BrowserModule, RestModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        {provide: REST_BACKEND_CONFIG, useValue: {host: "jsonplaceholder.typicode.com", port: "443", scheme: "https"}},
        {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/posts"}},
        DSRestCollectionSetup, TrainCollection,
        TrainService]
})
export class AppModule {
}
