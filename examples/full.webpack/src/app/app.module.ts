import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DSRestCollectionSetup, REST_ADAPTER_CONFIG, REST_BACKEND_CONFIG, RestModule } from "ngdataservice";

import { AppComponent } from "./app.component";
import { CustomJsonDataParser, TrainCollection } from "./trains/model";
import { InMemoryWebApiModule, InMemoryDbService } from "angular-in-memory-web-api";
import { REST_BACKEND_PARSER } from "ngdataservice";
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
    imports: [
        BrowserModule, RestModule,  InMemoryWebApiModule.forRoot(DbCreator, {host: "http://localapi", delay: 1000}),
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        {provide: REST_BACKEND_CONFIG, useValue: {url: "localapi"}},
        {provide: REST_BACKEND_PARSER, useClass: CustomJsonDataParser },
        {provide: REST_ADAPTER_CONFIG, useValue: {basePath: "/posts"}},
        DSRestCollectionSetup, TrainCollection],
    bootstrap: [AppComponent]
})
export class AppModule {
}
