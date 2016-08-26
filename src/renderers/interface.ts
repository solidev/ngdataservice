export interface IDSRequestRenderer {
    render(data: any): any;
}

export interface IDSRequestRendererProvider {
    provide(params: any): IDSRequestRenderer;
}