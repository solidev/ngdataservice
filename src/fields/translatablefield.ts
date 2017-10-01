import {DSFieldMetadataKey} from "./interface";
export function TranslatableField(params: any): any {
    return (target: any, key: string) => {
        let _val = this[key];
        // property getter
        let getter = function () {
            console.log(`Get: ${key} => ${_val}`);
            return _val;
        };

        // property setter
        let setter = function (newVal) {
            console.log(`Set: ${key} => ${newVal}`);
            _val = newVal;
        };

        // Delete property.
        if (delete this[key]) {

            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }

        // Store metadata
    };
}
