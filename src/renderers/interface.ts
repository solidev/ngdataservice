export interface IDSRequestRenderer {
    prepare(data: any): any;
    render(data: any): any;
}

export interface IDSRequestRendererProvider {
    provide(params: any): IDSRequestRenderer;
}