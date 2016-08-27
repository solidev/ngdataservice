import * as replace from "lodash/replace";
// export interface IObjectSearchParam {
//   key:string;
//   value:string;
// }
//
// export interface IObjectPathParam {
//   key:string;
//   value:string;
// }
//
// export interface IObjectUrlOptions {
//   ignore?:{
//     path?:string[];
//     search?:string[];
//   };
// }
//
// export class ObjectUrl {
//   public path:string;
//   public curl:string;
//   private _path:string;
//   private _pathParams:IObjectPathParam[];
//   private _searchParams:IObjectSearchParam[];
//   private _options:IObjectUrlOptions;
//
//   constructor(path:string,
//               pathparams:any = {},
//               searchparams:any = {},
//               options:IObjectUrlOptions = {}) {
//     this._path = path;
//     this._options = options;
//     this._pathParams = _(pathparams)
//       .map((value:string, key:any) => {
//         return {key: key, value: value.toString()};
//       })
//       .sortBy(["key"])
//       .value();
//     this._searchParams = _(searchparams)
//       .map((value:string, key:any) => {
//         return {key: key, value: encodeURIComponent(value.toString())};
//       })
//       .sortBy(["key"])
//       .value();
//     this._buildUrls();
//   }
//
//   private _buildUrls():void {
//     this.path = this._path;
//     this.curl = this._path;
//     for (let pp of this._pathParams) {
//       this.path = _.replace(this.path, `{${pp.key}}`, pp.value);
//       if (this._options.ignore && this._options.ignore.path) {
//         if (!_.includes(this._options.ignore.path, pp.key)) {
//           this.curl = _.replace(this.curl, `{${pp.key}}`, pp.value);
//         }
//       } else {
//         this.curl = _.replace(this.curl, `{${pp.key}}`, pp.value);
//       }
//     }
//     let search:string[] = [];
//     let csearch:string[] = [];
//     for (let sp of this._searchParams) {
//       search.push(`${sp.key}=${sp.value}`);
//       if (this._options.ignore && this._options.ignore.search) {
//         if (!_.includes(this._options.ignore.search, sp.key)) {
//           csearch.push(`${sp.key}=${sp.value}`);
//         }
//       } else {
//         csearch.push(`${sp.key}=${sp.value}`);
//       }
//     }
//     if (search.length > 0) {
//       this.path += "?" + search.join("&");
//     }
//     if (csearch.length > 0) {
//       this.curl += "?" + csearch.join("&");
//     }
//
//   }
// }

export interface IUrlBuilderParams {
    baseUrl?:string;
    objectUrl?:string;
    listUrl?:string;
}


/**
 * Builds object / list path from item/identifier data, search params & options.
 * @todo to be implemented using canonical params ordering (see ObjectUrl)
 */
export class UrlBuilder {

    /**
     * Constructor
     * @todo define parameters interface.
     * @param _params use urlbuilder parameters.
     */
    constructor(private _params:IUrlBuilderParams) {
    }

    /**
     * Returns object canonical path.
     * @param identifier object identifier parameters
     * @param search search object
     * @param item optional item instance
     * @returns {any}
     */
    public ocurl(identifier:any, search:any, item:any = null):string {
        let url = this._params.objectUrl;
        for (let p in identifier) {
            if (identifier.hasOwnProperty(p)) {
                url = replace(url, `{${p}}`, identifier[p]);
            }
        }
        return url;
    }

    /**
     * Returns object full path.
     * @param identifier object identifier parameters
     * @param search search object
     * @param item optional item instance
     * @returns {any}
     */
    public ourl(identifier:any, search:any, item:any = null):string {
        let url = this._params.objectUrl;
        for (let p in identifier) {
            if (identifier.hasOwnProperty(p)) {
                url = replace(url, `{${p}}`, identifier[p]);
            }
        }
        return url;
    }

    /**
     * Returns list canonical path.
     * @param identifier object identifier parameters
     * @param search search object
     * @returns {any}
     */
    public lcurl(identifier:any, search:any):string {
        let url = this._params.listUrl;
        for (let p in identifier) {
            if (identifier.hasOwnProperty(p)) {
                url = replace(url, `{${p}}`, identifier[p]);
            }
        }
        return url;
    }

    /**
     * Returns list path.
     * @param identifier object identifier parameters
     * @param search search object
     * @returns {any}
     */
    public lurl(identifier:any, search:any):string {
        let url = this._params.listUrl;
        for (let p in identifier) {
            if (identifier.hasOwnProperty(p)) {
                url = replace(url, `{${p}}`, identifier[p]);
            }
        }
        return url;
    }
}
