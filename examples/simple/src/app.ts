// our root app component
import {Component, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TrainService} from "./model";
import {RestModule} from "lib/datastore.module";
import {REST_BACKEND_CONFIG} from "lib/backends/rest";
import {REST_ADAPTER_CONFIG} from "lib/adapters/resturl";


@Component({
    selector: "my-app",
    template: `
    <div>
      <h2>Hello {{name}}</h2>

    </div>
  `,
})
export class App {
    constructor(public train: TrainService) {
        this.name = "Train service ?" + this.train.backend._config.host;
        console.log(this.train);
    }
}


@NgModule({
    imports: [ BrowserModule, RestModule],
    declarations: [ App ],
    bootstrap: [ App ],
    providers: [TrainService,
        {provide: REST_BACKEND_CONFIG, useValue: {host: "localhost", port: "8000", scheme: "http"}},
        {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/api/v1/trains"}}]
})
export class AppModule {}
