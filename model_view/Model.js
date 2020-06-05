import {
  strFormat,
  instanceOf,
  forEach
} from "../core/Tigerian.js";
import {
  ModelView
} from "../core/ModelView.js";
import {
  ModelField
} from "./ModelField.js";
import {
  Ajax
} from "../core/Ajax.js";

/**
 * Created by samir on 8/27/18.
 */

("use strict");

/**
 * @extends {ModelView}
 * @constructor
 */
export class Model extends ModelView {
  /**
   * @constructs
   * @param {string} appPath
   * @param {string} apiPath
   * @param {string|Function} idType = Number
   * @param {string} fetchField = ""
   */
  constructor(appPath, apiPath, idType = Number, fetchField = "") {
    super();

    /**
     * @type {ModelField[]}
     */
    let fields = {
      id: new ModelField("id", idType)
    };
    // let relations = [];
    let addApiPath = apiPath;
    let editApiPath = apiPath;
    let deleteApiPath = apiPath;
    let reloadApiPath = apiPath;
    let searchApiPath = apiPath;
    let countApiPath = apiPath;
    // let constructorArgs = Array.from(arguments);

    let instance = this;

    if (!instanceOf(fetchField, String) || (fetchField === "")) {
      fetchField = [];
    } else {
      fetchField = fetchField.split(".");
    }

    let getPath = function (path) {
      let result = (appPath === "") ? "/" : appPath;
      let flds = {};

      forEach(fields, (field, idx) => {
        flds[idx] = field.value;
      });

      if (!result.endsWith("/")) {
        result += "/";
      }

      if (!result.startsWith("/")) {
        result = "/" + result;
      }

      if (path.startsWith("/")) {
        path = path.substring(1);
      }

      result += strFormat(path, flds);

      return result;
    };

    let fillFields = function (out, values) {
      for (let i = 0;
        (i < fetchField.length) && (Object.keys(values).length > 0); i++) {
        if (fetchField[i] in values) {
          values = values[fetchField[i]];
        } else {
          values = {};
        }
      }
      forEach(values, (fieldValue, fieldName) => {
        if (out.hasOwnProperty(fieldName)) {
          out[fieldName] = fieldValue;
        }
      })

      // for (let name in relations) {
      //     switch (relations[name].multi) {
      //         case Model.EOneToOne:
      //             relations[name].value[relations[name].roleB] = fields[relations[name].roleA].value;
      //             relations[name].value.reload();
      //             break;

      //         case Model.EOneToStar:
      //             break;

      //         default:
      //     }
      // }
    };

    let ajaxSuccess = function (successFunc, unsuccessFunc) {
      return function (text, xml, json) {
        if (json !== undefined) {
          fillFields(instance, json);

          if (instanceOf(successFunc, "function")) {
            successFunc();
          }
        } else {
          ajaxUnsuccess(unsuccessFunc)(4, 501, text);
        }
      };
    };


    let ajaxSearchSuccess = function (successFunc, unsuccessFunc) {
      return function (text, xml, json) {
        if (json !== undefined) {
          let rows = [];
          forEach(json, (item, recordNo) => {
            let row = new instance.constructor();
            fillFields(row, item);
            rows.push(row);
          });

          if (instanceOf(successFunc, "function")) {
            successFunc(rows);
          }
        } else {
          if (instanceOf(unsuccessFunc, "function")) {
            unsuccessFunc(text);
          }
        }
      };
    };

    let ajaxUnsuccess = function (unsuccessFunc) {
      return function (readystate, status, statusText) {
        if (instanceOf(unsuccessFunc, "function")) {
          unsuccessFunc(statusText);
        } else {
          // console.error(statusText);
          throw statusText;
        }
      }
    };

    /**
     * @member {string|number}
     */
    this.defineProperty("id", {
      get() {
        return fields["id"].value;
      },
      set(v) {
        fields["id"].value = v;
      },
      type: idType
    });

    /**
     * @member {string}
     */
    this.defineProperty("addApiPath", {
      get() {
        return addApiPath;
      },
      set(v) {
        addApiPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("editApiPath", {
      get() {
        return editApiPath;
      },
      set(v) {
        editApiPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("deleteApiPath", {
      get() {
        return deleteApiPath;
      },
      set(v) {
        deleteApiPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("reloadApiPath", {
      get() {
        return reloadApiPath;
      },
      set(v) {
        reloadApiPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("searchApiPath", {
      get() {
        return searchApiPath;
      },
      set(v) {
        searchApiPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("countApiPath", {
      get() {
        return countApiPath;
      },
      set(v) {
        countApiPath = v;
      },
      type: String
    });

    /**
     * @param {string} name
     * @param {string|Function} type
     * @param {boolean} collection
     */
    this.defineMethod("addField", (name, type = String, collection = false) => {
      if (!(name in fields)) {
        fields[name] = new ModelField(name, type, collection, undefined);

        this.defineProperty(name, {
          get() {
            return fields[name].value;
          },
          set(v) {
            fields[name].value = v;
          },
          type: (collection ? Array : type)
          // type: [type, Object]
        });
      }
    }, [String, [String, Function], Boolean]);

    /**
     * 
     * @param {enumerator} multiplicity
     * @param {string} roleAFieldName
     * @param {string} roleBFieldName
     * @param {function} roleBType
     */
    // this.addRelation = function (name, multiplicity, roleAFieldName, roleBFieldName, roleBType) {
    //     if (isA(type, Model)) {
    //         switch (multiplicity) {
    //             case Model.EOneToOne:
    //             case Model.EOneToStar:
    //                 relation[name] = {
    //                     multi: multiplicity,
    //                     roleA: roleAFieldName,
    //                     roleB: roleBFieldName,
    //                     type: roleBType,
    //                     value: new roleBType(),
    //                 };
    //                 break;

    //             default:
    //         }

    //         this.defineProperty(name, {
    //             enumerable: false,
    //             configurable: false,
    //             get () {
    //                 return relations[name].value;
    //             },
    //         });
    //     }
    // };

    /**
     * @param {string} name
     */
    this.defineMethod("removeField", (name) => {
      if (name in fields) {
        delete fields[name];
        delete this[name];
      }
    }, [String]);

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    this.defineMethod("update", (success = () => {}, unsuccess = () => {}, progress = () => {}) => {
      let ajax = new Ajax();
      ajax.success = ajaxSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }

      let params = {};
      for (let field in fields) {
        if (fields[field].value !== undefined) {
          params[field] = fields[field].value;
        }
      }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(editApiPath);
        // params = {
        //     id: fields["id"].value,
        //     value: params
        // };
        ajax.put(params);
      } else {
        ajax.url = getPath(addApiPath);
        ajax.post(params);
      }
    }, [Function, Function, Function]);

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    this.defineMethod("delete", (success = () => {}, unsuccess = () => {}, progress = () => {}) => {
      let ajax = new Ajax();
      ajax.success = ajaxSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(deleteApiPath);
        ajax.delete({
          id: fields["id"].value
        }, ajaxSuccess, ajaxUnsuccess);
      }
    }, [Function, Function, Function]);

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    this.defineMethod("reload", (success = () => {}, unsuccess = () => {}, progress = () => {}) => {
      let ajax = new Ajax();
      ajax.success = ajaxSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(reloadApiPath);
        ajax.get({
          id: fields["id"].value
        });
      }
    }, [Function, Function, Function]);

    /**
     * @param {{}} options
     * @param {function} success
     * @param {function} unsuccess
     */
    this.defineMethod("search", (options = {}, success = () => {}, unsuccess = () => {}, progress = () => {}) => {
      let ajax = new Ajax();
      ajax.success = ajaxSearchSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      ajax.progress = progress;

      let params = {
        options
      };
      for (let field in fields) {
        if (fields[field].value !== undefined) {
          if (field !== "id") {
            params[field] = fields[field].value;
          }
        }
      }

      ajax.url = getPath(searchApiPath);
      // console.warning(ajax.url);
      ajax.get(params, ajaxSearchSuccess, ajaxUnsuccess);
    }, [Object, Function, Function, Function]);

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    this.defineMethod("count", (success = () => {}, unsuccess = () => {}, progress = () => {}) => {
      let ajax = new Ajax();
      ajax.success = function (text, xml, json) {
        if (instanceOf(success, "function")) {
          success(json["count"]);
        }
      };
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }


      let params = {
        options: {
          count: true
        }
      };
      for (let field in fields) {
        if (fields[field].value !== undefined) {
          params[field] = fields[field].value;
        }
      }

      ajax.url = getPath(countApiPath);
      ajax.get(params);
    }, [Function, Function, Function]);

    this.defineMethod("toJSON", () => {
      let result = {};
      forEach(fields, (field, fieldName) => {
        if (instanceOf(field.value, Model)) {
          result[fieldName] = field.value.toJSON();
        } else {
          result[fieldName] = field.value;
        }
      });

      return result;
    });
  }
}