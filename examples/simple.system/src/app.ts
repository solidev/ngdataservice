import {Component, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {DSRestCollectionSetup, REST_ADAPTER_CONFIG, REST_BACKEND_CONFIG, RestModule} from "ngdataservice";
import {Train, TrainCollection} from "./model";


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

    constructor(private _trains: TrainCollection) {
        this._trains.get(1).subscribe((t) => {
            console.log("Got train", t);
            this.train = t;
        });
    }
}

@NgModule({
    imports: [BrowserModule, RestModule],
    declarations: [AppComponent],
    providers: [{
        provide: REST_BACKEND_CONFIG,
        useValue: {host: "jsonplaceholder.typicode.com", port: "443", scheme: "https"}
    },
        {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/posts"}},
        DSRestCollectionSetup, TrainCollection, TrainCollection],
    bootstrap: [AppComponent]
})
export class AppModule {
}

