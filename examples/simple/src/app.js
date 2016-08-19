"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// our root app component
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var model_1 = require("./model");
var datastore_module_1 = require("lib/datastore.module");
var App = (function () {
    function App(train) {
        this.train = train;
        this.name = "Train service ?" + this.train.name;
        console.log(this.train);
    }
    App = __decorate([
        core_1.Component({
            selector: "my-app",
            template: "\n    <div>\n      <h2>Hello {{name}}</h2>\n\n    </div>\n  ",
        })
    ], App);
    return App;
}());
exports.App = App;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, datastore_module_1.RestModule],
            declarations: [App],
            bootstrap: [App],
            providers: [model_1.TrainService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
