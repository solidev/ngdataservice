import { Observable } from "rxjs/Observable";
import { IDSAuthentication, IDSAuthenticationClass, IDSAuthenticationProvider } from "../authentication/interface";
import { IDSResponseParser, IDSResponseParserClass, IDSResponseParserProvider } from "../parsers/interface";
import { IDSRequestRenderer, IDSRequestRendererClass, IDSRequestRendererProvider } from "../renderers/interface";

export interface IDSBackendConfig {
    authentication?: IDSAuthentication;
    authentication_class?: IDSAuthenticationClass;
    authentication_provider?: IDSAuthenticationProvider;
    authentication_config?: any;
    parser?: IDSResponseParser;
    parser_class?: IDSResponseParserClass;
    parser_provider?: IDSResponseParserProvider;
    parser_config?: any;
    renderer?: IDSRequestRenderer;
    renderer_class?: IDSRequestRendererClass;
    renderer_provider?: IDSRequestRendererProvider;
    renderer_config?: any;
}


export interface IDSBackend {
    authentication?: IDSAuthentication;
    authentication_class?: IDSAuthenticationClass;
    authentication_provider?: IDSAuthenticationProvider;
    authentication_config?: any;
    parser?: IDSResponseParser;
    parser_class?: IDSResponseParserClass;
    parser_provider?: IDSResponseParserProvider;
    parser_config?: any;
    renderer?: IDSRequestRenderer;
    renderer_class?: IDSRequestRendererClass;
    renderer_provider?: IDSRequestRendererProvider;
    renderer_config?: any;

    retrieve(identifier: any, params: any): Observable<any>;
    list(identifier: any, params: any): Observable<any>;
    create(identifier: any, values: any, params: any): Observable<any>;
    update(identifier: any, values: any, params: any): Observable<any>;
    partial_update(identifier: any, values: any, params: any): Observable<any>;
    destroy(identifier: any, params: any): Observable<any>;
    action(identifier: any, action: string, params: any): Observable<any>;

}

export interface IDSBackendClass {
    new(params: any): IDSBackend;
}

export interface IDSBackendProvider {
    provide(params: any): IDSBackend;
}
