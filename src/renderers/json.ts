import {Injectable} from "@angular/core";
import {IDSRequestRenderer, IDSRequestRendererProvider} from "./interface";
import {RequestOptions} from "@angular/http";

@Injectable()
export class DSJsonRenderer implements IDSRequestRenderer {
    public prepare(options: RequestOptions): RequestOptions {
        options.headers.set("content-type", "application/json");
        return options;
    }

    public render(data: any): any {
        return JSON.stringify(data);
    }
}


@Injectable()
export class DSJsonRendererProvider implements IDSRequestRendererProvider {
    public provide(params: any = {}): DSJsonRenderer {
        return new DSJsonRenderer();
    }
}
