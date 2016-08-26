// our root app component
import {Component, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TrainCollection, Train} from "./model";
import {RestModule} from "lib/datastore.module";
import {REST_BACKEND_CONFIG} from "lib/backends/rest";
import {REST_ADAPTER_CONFIG} from "lib/adapters/resturl";


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
        console.log(this._trains);
        this._trains.get(1).subscribe((t) => {
            console.log("Got train", t);
            this.train = t;
        });
    }
}


@NgModule({
    imports: [ BrowserModule, RestModule],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ],
    providers: [TrainCollection,
        {provide: REST_BACKEND_CONFIG, useValue: {host: "localhost", port: "8000", scheme: "http"}},
        {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/api/v1/trains"}}]
})
export class AppModule {}
