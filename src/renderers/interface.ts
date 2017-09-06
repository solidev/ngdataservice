export type IDSRequestRendererPrepareParams = any;
export type IDSRequestRendererRenderParams = any;

export interface IDSRequestRenderer {
    prepare(data: any, params?: IDSRequestRendererPrepareParams): any;
    render(data: any, params?: IDSRequestRendererRenderParams): any;
}

export interface IDSRequestRendererClass {
    new(params: any): IDSRequestRenderer;
}
export interface IDSRequestRendererProvider {
    provide(params: any): IDSRequestRenderer;
}
