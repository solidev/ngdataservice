// our root app component
import {Component, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TrainService} from "./model";
import {HttpModule} from "@angular/http";


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
        this.name = "Train service ?" + this.train.name;
        console.log(this.train);
    }
}
import {DSRestDataService} from "lib/service/service";
import {DSRestBackend} from "lib/backends/rest";
import {DSDefaultSerializer} from "lib/serializers/default";
import {DSRestUrlAdapter} from "lib/adapters/resturl";
import {DSRegister} from "lib/register/register";
import {DSMemoryPersistence} from "lib/persistence/memory";
import {DSJsonParser} from "lib/parsers/json";
import {DSJsonRenderer} from "lib/renderers/json";

@NgModule({
    imports: [ BrowserModule, HttpModule],
    declarations: [ App ],
    bootstrap: [ App ],
    providers: [TrainService, DSRestDataService, DSDefaultSerializer, DSRestUrlAdapter, DSRegister, DSMemoryPersistence, DSJsonParser, DSJsonRenderer]
})
export class AppModule {}
