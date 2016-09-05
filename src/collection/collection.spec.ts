import {expect} from "chai";
import * as sinon from "sinon";
import {DSModel} from "../model/model";
import {DSCollection} from "./collection";
import {Observable} from "rxjs";


describe("DSCollection", () => {
    describe("configuration", () => {
        it("should be configured via local properties", () => {
            let ds: any = new DSCollection<DSModel>({});
            ds.adapter = <any>"A";
            expect(ds.get_adapter()).to.equal("A");
        });
        it("should be configured via local providers", () => {
            let ds: any = new DSCollection<DSModel>({});
            let prov: any = {provide: sinon.stub().returns("A")};
            ds.adapter_provider = prov;
            expect(ds.get_adapter()).to.equal("A");
            expect(prov.provide.calledOnce).to.be.true;
        });

        it("should be configured via setup parameters", () => {
            let ds: any = new DSCollection<DSModel>({adapter: <any>"A"});
            expect(ds.get_adapter()).to.equal("A");
        });

        it("should be configured via setup parameters provider", () => {
            let prov: any = {provide: sinon.stub().returns("A")};
            let ds: any = new DSCollection<DSModel>({adapter_provider: prov});
            expect(ds.get_adapter()).to.equal("A");
            expect(prov.provide.calledOnce).to.be.true;
        });

        it("should take precedence on local value instead of provider", () => {
            let ds: any = new DSCollection<DSModel>({});
            let prov: any = {provide: sinon.stub().returns("A")};
            ds.adapter = <any>"B";
            ds.adapter_provider = prov;
            expect(ds.get_adapter()).to.equal("B");
            expect(prov.provide.called).to.be.false;
        });

        it("should take precedence on setup value instead of setup provider", () => {
            let prov: any = {provide: sinon.stub().returns("B")};
            let ds: any = new DSCollection<DSModel>({adapter: <any>"A", adapter_provider: prov});
            expect(ds.get_adapter()).to.equal("A");
            expect(prov.provide.called).to.be.false;
        });

        it("should take precedence on local instead of provider", () => {
            let prov1: any = {provide: sinon.stub().returns("B")};
            let prov2: any = {provide: sinon.stub().returns("D")};
            let ds: any = new DSCollection<DSModel>({adapter: <any>"C", adapter_provider: prov2});
            ds.adapter = <any>"A";
            ds.adapter_provider = prov1;
            expect(ds.get_adapter()).to.equal("A");
            expect(prov1.provide.called).to.be.false;
            expect(prov2.provide.called).to.be.false;
        });

        it("should throw an error if nothing is defined", () => {
            let ds: any = new DSCollection<DSModel>({});
            expect(ds.get_adapter.bind(ds)).to.throw("adapter service is not defined");
        });

        it("should load provider's configuration from local values", () => {
            let ds: any = new DSCollection<DSModel>({});
            let prov: any = {provide: sinon.stub().returns("A")};
            ds.adapter_provider = prov;
            ds.adapter_config = "C";
            expect(ds.get_adapter()).to.equal("A");
            expect(prov.provide.calledOnce).to.be.true;
            expect(prov.provide.args[0][0]).to.equal("C");
        });

        it("should load provider's configuration from setup values", () => {
            let ds: any = new DSCollection<DSModel>({adapter_config: "D"});
            let prov: any = {provide: sinon.stub().returns("A")};
            ds.adapter_provider = prov;
            expect(ds.get_adapter()).to.equal("A");
            expect(prov.provide.calledOnce).to.be.true;
            expect(prov.provide.args[0][0]).to.equal("D");
        });
        it("should load prefer local provider's configuration from setup values", () => {
            let ds: any = new DSCollection<DSModel>({adapter_config: "D"});
            let prov: any = {provide: sinon.stub().returns("A")};
            ds.adapter_provider = prov;
            ds.adapter_config = "C";
            expect(ds.get_adapter()).to.equal("A");
            expect(prov.provide.calledOnce).to.be.true;
            expect(prov.provide.args[0][0]).to.equal("C");
        });

        it("should load adapter via get_adapter", () => {
            let ds: any = new DSCollection<DSModel>({});
            ds.adapter = <any>"A";
            expect(ds.get_adapter()).to.equal("A");
        });
        it("should load backend via get_backend", () => {
            let ds: any = new DSCollection<DSModel>({});
            ds.backend = <any>"A";
            expect(ds.get_backend()).to.equal("A");
        });
        it("should load serializer via get_serializer", () => {
            let ds: any = new DSCollection<DSModel>({});
            ds.serializer = <any>"A";
            expect(ds.get_serializer()).to.equal("A");
        });
        it("should load persistence via get_persistence", () => {
            let ds: any = new DSCollection<DSModel>({});
            ds.persistence = <any>"A";
            expect(ds.get_persistence()).to.equal("A");
        });
        it("should load authentication via get_authentication", () => {
            let ds: any = new DSCollection<DSModel>({});
            ds.authentication = <any>"A";
            expect(ds.get_authentication()).to.equal("A");
        });
        it("should load paginator via get_paginator", () => {
            let ds: any = new DSCollection<DSModel>({});
            ds.paginator = <any>"A";
            expect(ds.get_paginator()).to.equal("A");
        });
    });

    describe("save/retrieve/update/delete", () => {
        let mockAdapter: any;
        let mockBackend: any;
        let mockSerializer: any;
        let mockPersistence: any;
        let mockAuthentication: any;
        let mockPaginator: any;
        let ds: DSCollection<DSModel>;

        beforeEach(() => {
            mockAdapter = {identifier: sinon.stub()};
            mockBackend = {
                create: (obj) => {
                    obj.id = 1;
                    return Observable.of(obj);
                }
            };
            mockSerializer = {
                serialize: (arg) => {
                    return arg;
                },
                deserialize: (arg) => {
                    return arg;
                }
            };
            mockPersistence = {
                retrieve: sinon.stub(),
                destroy: sinon.stub(),
                save: sinon.stub()
            };
            mockAuthentication = {};
            mockPaginator = {};
            ds = new DSCollection<DSModel>({});
            ds.model = <any>DSModel;
            (<any>ds).adapter = <any>mockAdapter;
            (<any>ds).backend = <any>mockBackend;
            (<any>ds).serializer = <any>mockSerializer;
            (<any>ds).persistence = <any>mockPersistence;
            (<any>ds).authentication = <any>mockAuthentication;
        });


        it("should create an empty object, storing it in persistence", (done) => {
            mockAdapter.identifier.returns({path: "?__local__/api/123"});
            ds.create().subscribe((obj) => {
                expect(obj).to.be.instanceOf(DSModel);
                expect(mockPersistence.save.called).to.be.true;
                expect(mockPersistence.save.args[0][0]).to.have.property("path", "?__local__/api/123");
                done();
            });
        });
        it("should create an empty object, not storing it in persistence if volatile is true", (done) => {
            ds.create({}, {volatile: true}).subscribe((obj) => {
                expect(obj).to.be.instanceOf(DSModel);
                expect(mockPersistence.save.called).to.be.false;
                done();
            });
        });
        it("should create and save an empty object", (done) => {
            mockAdapter.identifier
                .onFirstCall().returns(null)
                .onSecondCall().returns("/api")
                .onThirdCall().returns("/api/1");
            sinon.stub(mockSerializer, "serialize")
                .onFirstCall().returns({name: "train"});
            sinon.stub(mockSerializer, "deserialize")
                .onFirstCall().returns({id: 1, name: "train"});

            mockBackend.create = sinon.stub().returns(Observable.of({id: 1, name: "train"}));
            ds.create({name: "train"}, {save: true}).subscribe((obj) => {
                expect((<any>mockBackend.create).called).to.be.true;
                expect((<any>obj).id).to.equal(1);
                expect(obj).to.be.instanceOf(DSModel);
                done();
            });
        });

        it("should save(update) an existing object", (done) => {
            mockAdapter.identifier.returns("/api/1");
            sinon.stub(mockSerializer, "serialize")
                .returns({id: 1, name: "train"});
            sinon.stub(mockSerializer, "deserialize")
                .returns({id: 1, name: "train"});
            mockBackend.update = sinon.stub()
                .returns(Observable.of({id: 1, name: "train"}));
            let obj = new DSModel(this, {id: 1, name: "train"});

            ds.save(obj).subscribe((res) => {
                expect((<any>obj).id).to.equal(1);
                expect(mockBackend.update.calledOnce).to.be.true;
                done();
            });
        });

        it("should not (update) a non-existing object", (done) => {
            mockAdapter.identifier.returns(null);
            let obj = new DSModel(this, {name: "train"});
            expect(ds.update.bind(ds, [obj])).to.throw("Cannot update unsaved item");
            done();
        });

        it("should not delete an existing existing object", (done) => {
            mockAdapter.identifier.returns("/api/1");
            sinon.stub(mockSerializer, "serialize")
                .returns({id: 1, name: "train"});
            sinon.stub(mockSerializer, "deserialize")
                .returns({id: 1, name: "train"});
            mockBackend.destroy = sinon.stub()
                .returns(Observable.of({id: 1, name: "train"}));
            let obj = new DSModel(this, {id: 1, name: "train"});

            ds.remove(obj).subscribe((res) => {
                expect(mockPersistence.destroy.calledOnce).to.be.true;
                expect(mockBackend.destroy.calledOnce).to.be.true;
                done();
            });
        });

        it("should not remove a non-existing object", (done) => {
            mockAdapter.identifier.returns(null);
            let obj = new DSModel(this, {name: "train"});
            expect(ds.remove.bind(ds, [obj])).to.throw("Cannot delete unsaved item");
            done();
        });


    });
});
