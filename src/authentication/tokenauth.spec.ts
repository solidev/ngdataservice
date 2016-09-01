import {DSTokenAuthentication, DSTokenAuthenticationProvider} from "./tokenauth";
import {expect} from "chai";
import {Headers} from "@angular/http";
import {TestBed, inject} from "@angular/core/testing";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing"
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());


describe("DSTokenAuthentication", () => {
    it("should store authentication and add headers", () => {
        let auth = new DSTokenAuthentication();
        let headers = new Headers();
        auth.authenticate("xxxxx", "X-Auth");
        let authheaders = auth.setAuthHeaders(headers);
        expect(authheaders.get("x-auth")).to.equal("xxxxx");
        expect(headers.get("x-auth")).to.equal("xxxxx");
        expect(auth.setAuthContent("azerty")).to.equal("azerty");
    });

    it("should use X-Token header by default", () => {
        let auth = new DSTokenAuthentication();
        let headers = new Headers();
        auth.authenticate("xxxxx");
        let authheaders = auth.setAuthHeaders(headers);
        expect(authheaders.get("x-token")).to.equal("xxxxx");
        expect(headers.get("x-token")).to.equal("xxxxx");
        expect(auth.setAuthContent("azerty")).to.equal("azerty");
    });

    it("should be back to anonymous", () => {
        let auth = new DSTokenAuthentication();
        let headers = new Headers();
        auth.authenticate("xxxxx", "X-Auth");
        auth.anonymous();
        let authheaders = auth.setAuthHeaders(headers);
        expect(authheaders.get("x-auth")).to.be.null;
        expect(headers.get("x-auth")).to.be.null;
        expect(auth.setAuthContent("azerty")).to.equal("azerty");
    });

    it("should be injectable", (done) => {
        TestBed.configureTestingModule({
            providers: [
                DSTokenAuthentication
            ]
        });
        inject([DSTokenAuthentication], (auth) => {
            let headers = new Headers();
            auth.authenticate("xxxxx", "X-Auth");
            let authheaders = auth.setAuthHeaders(headers);
            expect(authheaders.get("x-auth")).to.equal("xxxxx");
            done();
        })();
    });
});

describe("DSTokenAuthenticationProvider", () => {
    it("should return an authenticator", (done) => {
        TestBed.configureTestingModule({
            providers: [DSTokenAuthenticationProvider]
        });
        inject([DSTokenAuthenticationProvider], (provider) => {
            let auth = provider.provide();
            let headers = new Headers();
            auth.authenticate("xxxxx", "X-Auth");
            let authheaders = auth.setAuthHeaders(headers);
            expect(authheaders.get("x-auth")).to.equal("xxxxx");
            done();
        })();

    });
});

