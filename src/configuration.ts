/**
 * Base class for setup.
 * Provides services instanciation and configuration through constructor / setup objects / parameters.
 */
export class DSConfig<T> {
    protected setup: T;

    /**
     * Retrieve a service from config, by name.
     *
     * Services can be provided (first present is taken)
     * - using name_class in object methods (an instance is created, using config as constructor argument)
     * - using name_provider if object properties (the service is retrieved using provide(config) method from provider)
     * - using object setup[name] property : instance is directly used
     * - using object setup[name_class] property (an instance is created, using config as constructor arguments)
     * - using object setup[name_provider] property (service instance is retrieved using provide(config))
     *
     * if no instance can be found, an error is thrown
     *
     * @param name : service name
     * @param config : config values
     * @param store : if true, store result in _name property
     * @returns {any} service instance
     */
    protected get_service(name: string, config: any, store = true): any {
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

    /**
     * Retrieve service configuration values :
     *
     * - from name_config property on collection
     * - from setup[name_config] property
     *
     * @param name service name
     * @returns {any} service configuration (null if no config found)
     */
    protected get_service_config(name: string): any {
        if (this[name + "_config"]) {
            return this[name + "_config"];
        } else if (this.setup[name + "_config"]) {
            return this.setup[name + "_config"];
        } else {
            return null;
        }
    }

}
