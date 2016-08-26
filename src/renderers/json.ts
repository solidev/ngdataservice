import {Injectable} from "@angular/core";
import {IDSRequestRenderer, IDSRequestRendererProvider} from "./interface";

@Injectable()
export class DSJsonRenderer implements IDSRequestRenderer {
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
