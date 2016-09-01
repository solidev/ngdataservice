import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TrainCollection, TrainService} from "./trains/model";
import {REST_BACKEND_CONFIG, REST_ADAPTER_CONFIG, RestModule, DSRestCollectionSetup} from "ng2datastore";
import {AppComponent} from "./app.component";
import {InMemoryWebApiModule, InMemoryDbService} from "./api";

class DbCreator implements InMemoryDbService {
    public createDb(): any {
        return {
            "posts": [
                {id: 1, title: "Train 1"},
                {id: 2, title: "Train 2"},
                {id: 3, title: "Train 3"},
                {id: 4, title: "Train 4"}
            ]
        };
    }
}

@NgModule({
    imports: [BrowserModule, RestModule, InMemoryWebApiModule.forRoot(DbCreator, {host: "http://testapi", delay: 2000})],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        {provide: REST_BACKEND_CONFIG, useValue: {url: "localapi"}},
        {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/posts"}},
        DSRestCollectionSetup, TrainCollection,
        TrainService]
})
export class AppModule {
}
