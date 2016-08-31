import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TrainCollection, TrainService} from "./trains/model";
import {REST_BACKEND_CONFIG, REST_ADAPTER_CONFIG, RestModule, DSRestCollectionSetup} from "../src/index";
import {AppComponent} from "./app.component";

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
