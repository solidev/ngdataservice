"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var model_1 = require("lib/model/model");
var collection_1 = require("lib/collection/collection");
var core_1 = require("@angular/core");
var service_1 = require("lib/service/service");
var Train = (function (_super) {
    __extends(Train, _super);
    function Train() {
        _super.apply(this, arguments);
        this.id = 12;
    }
    return Train;
}(model_1.DSModel));
exports.Train = Train;
var TrainCollection = (function (_super) {
    __extends(TrainCollection, _super);
    function TrainCollection() {
        _super.apply(this, arguments);
    }
    TrainCollection = __decorate([
        core_1.Injectable()
    ], TrainCollection);
    return TrainCollection;
}(collection_1.DSCollection));
exports.TrainCollection = TrainCollection;
var TrainService = (function (_super) {
    __extends(TrainService, _super);
    function TrainService(backend, serializer, adapter, persistence, registry) {
        _super.call(this, backend, serializer, adapter, persistence, registry);
        this.backend = backend;
        this.serializer = serializer;
        this.adapter = adapter;
        this.persistence = persistence;
        this.registry = registry;
    }
    TrainService = __decorate([
        core_1.Injectable()
    ], TrainService);
    return TrainService;
}(service_1.DSRestDataService));
exports.TrainService = TrainService;
