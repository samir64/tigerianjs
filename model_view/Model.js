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
   * @param {string} applicationPath
   * @param {string} controllerPath
   * @param {string|Function} idType = Number
   * @param {string} fetchField = ""
   */
  constructor(applicationPath, controllerPath, idType = Number, fetchField = "") {
    super();

    /**
     * @type {ModelField[]}
     */
    var fields = {
      id: new ModelField("id", idType)
    };
    // var relations = [];
    var addPath = controllerPath;
    var editPath = controllerPath;
    var deletePath = controllerPath;
    var reloadPath = controllerPath;
    var searchPath = controllerPath;
    var countPath = controllerPath;
    // var constructorArgs = Array.from(arguments);

    var instance = this;

    if (!instanceOf(fetchField, String) || (fetchField === "")) {
      fetchField = [];
    } else {
      fetchField = fetchField.split(".");
    }

    var getPath = function (path) {
      var result = (applicationPath === "") ? "/" : applicationPath;
      var flds = {};

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

    var fillFields = function (out, values) {
      for (var i = 0;
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

      // for (var name in relations) {
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

    var ajaxSuccess = function (successFunc, unsuccessFunc) {
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


    var ajaxSearchSuccess = function (successFunc, unsuccessFunc) {
      return function (text, xml, json) {
        if (json !== undefined) {
          var rows = [];
          forEach(json, (item, recordNo) => {
            var row = new instance.constructor();
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

    var ajaxUnsuccess = function (unsuccessFunc) {
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
    this.defineProperty("addPath", {
      get() {
        return addPath;
      },
      set(v) {
        addPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("editPath", {
      get() {
        return editPath;
      },
      set(v) {
        editPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("deletePath", {
      get() {
        return deletePath;
      },
      set(v) {
        deletePath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("reloadPath", {
      get() {
        return reloadPath;
      },
      set(v) {
        reloadPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("searchPath", {
      get() {
        return searchPath;
      },
      set(v) {
        searchPath = v;
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("countPath", {
      get() {
        return countPath;
      },
      set(v) {
        countPath = v;
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
      var ajax = new Ajax();
      ajax.success = ajaxSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }

      var params = {};
      for (var field in fields) {
        if (fields[field].value !== undefined) {
          params[field] = fields[field].value;
        }
      }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(editPath);
        // params = {
        //     id: fields["id"].value,
        //     value: params
        // };
        ajax.put(params);
      } else {
        ajax.url = getPath(addPath);
        ajax.post(params);
      }
    }, [Function, Function, Function]);

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    this.defineMethod("delete", (success = () => {}, unsuccess = () => {}, progress = () => {}) => {
      var ajax = new Ajax();
      ajax.success = ajaxSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(deletePath);
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
      var ajax = new Ajax();
      ajax.success = ajaxSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(reloadPath);
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
      var ajax = new Ajax();
      ajax.success = ajaxSearchSuccess(success, unsuccess);
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      ajax.progress = progress;

      var params = {
        options
      };
      for (var field in fields) {
        if (fields[field].value !== undefined) {
          if (field !== "id") {
            params[field] = fields[field].value;
          }
        }
      }

      ajax.url = getPath(searchPath);
      // console.warning(ajax.url);
      ajax.get(params, ajaxSearchSuccess, ajaxUnsuccess);
    }, [Object, Function, Function, Function]);

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    this.defineMethod("count", (success = () => {}, unsuccess = () => {}, progress = () => {}) => {
      var ajax = new Ajax();
      ajax.success = function (text, xml, json) {
        if (instanceOf(success, "function")) {
          success(json["count"]);
        }
      };
      ajax.unsuccess = ajaxUnsuccess(unsuccess);
      if (instanceOf(progress, "function")) {
        ajax.progress = progress;
      }


      var params = {
        options: {
          count: true
        }
      };
      for (var field in fields) {
        if (fields[field].value !== undefined) {
          params[field] = fields[field].value;
        }
      }

      ajax.url = getPath(countPath);
      ajax.get(params);
    }, [Function, Function, Function]);

    this.defineMethod("toJSON", () => {
      var result = {};
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