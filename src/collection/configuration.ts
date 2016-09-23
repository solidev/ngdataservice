import {IDSCollectionSetup} from "./interface";
export class DSConfiguration {
    protected setup: IDSCollectionSetup;

    protected get_service(name: string, config: any, store: boolean = true): any {
        if (!this["_" + name] || !store) {
            let result: any;
            if (this[name + "_class"]) {
                result = new this[name + "_class"](config);
            } else if (this[name + "_provider"]) {
                result = this[name + "_provider"].provide(config);
            } else if (this.setup[name]) {
                result = this.setup[name];
            } else if (this.setup[name + "_class"]) {
                result = new this.setup[name + "_class"](config);
            } else if (this.setup[name + "_provider"]) {
                let provider: any = this.setup[name + "_provider"];
                result = provider.provide(config);
            } else {
                throw new Error(name + " service is not defined");
            }
            if (store) {
                this["_" + name] = result;
            } else {
                return result;
            }
        }
        return this["_" + name];
    }

    protected get_service_config(name: string): any {
        if (this[name + "_config"]) {
            return this[name + "_config"];
        } else if (this.setup[name + "_config"]) {
            return this.setup[name + "_config"];
        } else {
            // SEE: default values ? false ? undefined ?
            return null;
        }
    }

}