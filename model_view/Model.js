import { strFormat, instanceOf, forEach, abstract } from "../core/Tigerian.js";
import { ModelView } from "../core/ModelView.js";
import { ModelField } from "./ModelField.js";
import { Ajax } from "../core/Ajax.js";
import { Events } from "../core/Events.js";
import { BPromise } from "../behaviors/BPromise.js";

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

    abstract(this, Model);

    let that = this;

    /**
     * @type {ModelField[]}
     */
    let fields = {
      id: new ModelField("id", idType)
    };
    // let relations = [];
    let addApiPath = apiPath;
    let editApiPath = apiPath;
    let removeApiPath = apiPath;
    let reloadApiPath = apiPath;
    let searchApiPath = apiPath;
    let countApiPath = apiPath;
    // let constructorArgs = Array.from(arguments);

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    let update = (resolve, reject, state, progress) => {
      let ajax = new Ajax();
      // ajax.addEvent(Events.onSuccess, e => {
      //   ajaxSuccess(success, unsuccess);
      // });

      // ajax.addEvent(Events.onUnsuccess, e => {
      //   ajaxUnsuccess(unsuccess);
      // });

      // if (instanceOf(progress, "function")) {
      //   ajax.progress = progress;
      // }

      let params = {};
      for (let field in fields) {
        if (fields[field].value !== undefined) {
          params[field] = fields[field].value;
        }
      }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(editApiPath);
        ajax
          .sendPut(params)
          .then((text, xml, json) => {
            resolve(json());
          })
          .reject(reject)
          .progress(progress);
      } else {
        ajax.url = getPath(addApiPath);
        ajax
          .sendPost(params)
          .then((text, xml, json) => {
            let value = json();

            fillFields(that, value);
            resolve(value);
          })
          .reject(reject)
          .change(state)
          .progress(progress);
      }
    };

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    let remove = (resolve, reject, state, progress) => {
      let ajax = new Ajax();
      // ajax.success = ajaxSuccess(success, unsuccess);
      // ajax.unsuccess = ajaxUnsuccess(unsuccess);
      // if (instanceOf(progress, "function")) {
      //   ajax.progress = progress;
      // }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(removeApiPath);
        ajax
          .sendDelete({
            id: fields["id"].value
          })
          .then((text, xml, json) => {
            resolve(json());
          })
          .reject(reject)
          .change(state)
          .progress(progress);
      }
    };

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    let reload = (resolve, reject, state, progress) => {
      let ajax = new Ajax();
      // ajax.success = ajaxSuccess(success, unsuccess);
      // ajax.unsuccess = ajaxUnsuccess(unsuccess);
      // if (instanceOf(progress, "function")) {
      //   ajax.progress = progress;
      // }

      if (fields["id"].value !== undefined) {
        ajax.url = getPath(reloadApiPath);
        ajax
          .sendGet({
            id: fields["id"].value
          })
          .then((text, xml, json) => {
            let value = json();

            fillFields(that, value);
            resolve(value);
          })
          .reject(reject)
          .change(state)
          .progress(progress);
      } else {
        reject(new Error("ID is empty."));
      }
    };

    /**
     * @param {{}} options
     * @param {function} success
     * @param {function} unsuccess
     */
    let search = (resolve, reject, state, progress, options = {}) => {
      let ajax = new Ajax();
      // ajax.success = ajaxSearchSuccess(success, unsuccess);
      // ajax.unsuccess = ajaxUnsuccess(unsuccess);
      // ajax.progress = progress;

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
      ajax
        .sendGet(params)
        .then((text, xml, json) => {
          let value = json();
          let rows = [];

          if (value !== undefined) {
            forEach(value, (item, recordNo) => {
              let row = new that.constructor();
              fillFields(row, item);
              rows.push(row);
            });
          } else {
            reject(text);
          }

          resolve(rows, value);
        })
        .reject(reject)
        .change(state)
        .progress(progress);
    };

    /**
     * @param {function} success
     * @param {function} unsuccess
     */
    let count = (resolve, reject, state, progress) => {
      let ajax = new Ajax();
      // ajax.success = (text, xml, json) => {
      //   if (instanceOf(success, "function")) {
      //     success(json["count"]);
      //   }
      // };
      // ajax.unsuccess = ajaxUnsuccess(unsuccess);
      // if (instanceOf(progress, "function")) {
      //   ajax.progress = progress;
      // }

      let params = {
        options: {
          count: true
        }
      };
      for (let field in fields) {
        if (field !== "id" && fields[field].value !== undefined) {
          params[field] = fields[field].value;
        }
      }

      ajax.url = getPath(countApiPath);
      ajax
        .sendGet(params)
        .then((text, xml, json) => {
          let value = json();
          resolve(value["count"]);
        })
        .reject(reject)
        .change(state)
        .progress(progress);
    };

    this.config(
      BPromise,
      [update, reload, remove, search, count],
      "state",
      "progress"
    );

    if (!instanceOf(fetchField, String) || fetchField === "") {
      fetchField = [];
    } else {
      fetchField = fetchField.split(".");
    }

    let getPath = path => {
      let result = appPath === "" ? "/" : appPath;
      let flds = {};

      forEach(fields, (field, idx) => {
        flds[idx] = field.value;
      });

      if (!result.endsWith("/")) {
        result += "/";
      }

      if (!result.startsWith("/") && !result.startsWith("http")) {
        result = "/" + result;
      }

      if (path.startsWith("/")) {
        path = path.substring(1);
      }

      result += strFormat(path, flds);

      return result;
    };

    let fillFields = (out, values) => {
      for (
        let i = 0;
        i < fetchField.length && Object.keys(values).length > 0;
        i++
      ) {
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
      });

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

    // let ajaxSuccess = (successFunc, unsuccessFunc) => {
    //   return (text, xml, json) => {
    //     if (json !== undefined) {
    //       fillFields(that, json);

    //       if (instanceOf(successFunc, "function")) {
    //         successFunc();
    //       }
    //     } else {
    //       ajaxUnsuccess(unsuccessFunc)(4, 501, text);
    //     }
    //   };
    // };

    // let ajaxSearchSuccess = (successFunc, unsuccessFunc) => {
    //   return (text, xml, json) => {
    //     if (json !== undefined) {
    //       let rows = [];
    //       forEach(json, (item, recordNo) => {
    //         let row = new that.constructor();
    //         fillFields(row, item);
    //         rows.push(row);
    //       });

    //       if (instanceOf(successFunc, "function")) {
    //         successFunc(rows);
    //       }
    //     } else {
    //       if (instanceOf(unsuccessFunc, "function")) {
    //         unsuccessFunc(text);
    //       }
    //     }
    //   };
    // };

    // let ajaxUnsuccess = unsuccessFunc => {
    //   return (readystate, status, statusText) => {
    //     if (instanceOf(unsuccessFunc, "function")) {
    //       unsuccessFunc(statusText);
    //     } else {
    //       // console.error(statusText);
    //       throw statusText;
    //     }
    //   };
    // };

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
      type: [idType, undefined]
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
    this.defineProperty("removeApiPath", {
      get() {
        return removeApiPath;
      },
      set(v) {
        removeApiPath = v;
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
    this.defineMethod(
      "addField",
      (name, type = String, collection = false) => {
        if (!(name in fields)) {
          fields[name] = new ModelField(name, type, collection, undefined);

          this.defineProperty(name, {
            get() {
              return fields[name].value;
            },
            set(v) {
              fields[name].value = v;
            },
            type: collection ? Array : type
            // type: [type, Object]
          });
        }
      },
      [String, [String, Function], Boolean]
    );

    /**
     *
     * @param {enumerator} multiplicity
     * @param {string} roleAFieldName
     * @param {string} roleBFieldName
     * @param {function} roleBType
     */
    // this.addRelation = (name, multiplicity, roleAFieldName, roleBFieldName, roleBType) => {
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
    this.defineMethod(
      "removeField",
      name => {
        if (name in fields) {
          delete fields[name];
          delete this[name];
        }
      },
      [String]
    );

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
