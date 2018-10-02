/**
 * Created by samir on 8/27/18.
 */

'use strict';

/**
 * @extends {Tigerian.ModelView}
 * @constructor
 */
Tigerian.Model = Tigerian.ModelView.extend({
    /**
     * @constructs
     * @param {string} applicationPath
     * @param {string} controllerPath
     * @param {string} idType
     * @param {string} fetchField = ""
     */
    init: function (applicationPath, controllerPath, idType, fetchField) {
        this.super();

        /**
         * @type {Tigerian.ModelField[]}
         */
        var fields = {
            id: new Tigerian.ModelField("id", idType)
        };
        // var relations = [];
        var addPath = controllerPath;
        var editPath = controllerPath;
        var deletePath = controllerPath;
        var reloadPath = controllerPath;
        var searchPath = controllerPath;
        var countPath = controllerPath;
        var constructorArgs = Array.from(arguments);

        var instance = this;

        if (!Tigerian.Class.isInstance(fetchField, "string")) {
            fetchField = [];
        } else {
            fetchField = fetchField.split(".");
        }

        var getPath = function (path) {
            var result = applicationPath;
            var flds = {};

            for (var idx in fields) {
                flds[idx] = fields[idx].value;
            }

            if (!result.endsWith("/")) {
                result += "/";
            }

            result += path.format(flds);

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
            for (var field in values) {
                if (out.hasOwnProperty(field)) {
                    out[field] = values[field];
                }
            }
            // for (var name in relations) {
            //     switch (relations[name].multi) {
            //         case Tigerian.Model.EOneToOne:
            //             relations[name].value[relations[name].roleB] = fields[relations[name].roleA].value;
            //             relations[name].value.reload();
            //             break;

            //         case Tigerian.Model.EOneToStar:
            //             break;

            //         default:
            //     }
            // }
        };

        var ajaxSuccess = function (successFunc, unsuccessFunc) {
            return function (text, xml, json) {
                if (json !== undefined) {
                    fillFields(instance, json);

                    if (Tigerian.Class.isInstance(successFunc, "function")) {
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
                    for (var recordNo in json) {
                        var row = new instance.constructor();
                        fillFields(row, json[recordNo]);
                        rows.push(row);
                    }

                    if (Tigerian.Class.isInstance(successFunc, "function")) {
                        successFunc(rows);
                    }
                } else {
                    if (Tigerian.Class.isInstance(unsuccessFunc, "function")) {
                        unsuccessFunc(text);
                    }
                }
            };
        };

        var ajaxUnsuccess = function (unsuccessFunc) {
            return function (readystate, status, statusText) {
                if (Tigerian.Class.isInstance(unsuccess, "function")) {
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
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: false,
            get: function () {
                return fields["id"].value;
            },
            set: function (value) {
                fields["id"].value = value;
            },
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "addPath", {
            enumerable: true,
            configurable: false,
            get: function () {
                return addPath;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    addPath = v;
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "editPath", {
            enumerable: true,
            configurable: false,
            get: function () {
                return editPath;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    editPath = v;
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "deletePath", {
            enumerable: true,
            configurable: false,
            get: function () {
                return deletePath;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    deletePath = v;
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "reloadPath", {
            enumerable: true,
            configurable: false,
            get: function () {
                return reloadPath;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    reloadPath = v;
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "searchPath", {
            enumerable: true,
            configurable: false,
            get: function () {
                return searchPath;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    searchPath = v;
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "countPath", {
            enumerable: true,
            configurable: false,
            get: function () {
                return countPath;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    countPath = v;
                }
            }
        });

        /**
         * @param {string} name
         * @param {string|function} type
         */
        this.addField = function (name, type) {
            if (!(name in fields)) {
                fields[name] = new Tigerian.ModelField(name, type, undefined);

                Object.defineProperty(this, name, {
                    enumerable: false,
                    configurable: false,
                    get: function () {
                        return fields[name].value;
                    },
                    set: function (v) {
                        fields[name].value = v;
                    },
                });
            }
        };

        /**
         * 
         * @param {enumerator} multiplicity
         * @@param {string} roleAFieldName
         * @@param {string} roleBFieldName
         * @param {function} roleBType
         */
        // this.addRelation = function (name, multiplicity, roleAFieldName, roleBFieldName, roleBType) {
        //     if (Tigerian.Class.isSubclass(type, Tigerian.Model)) {
        //         switch (multiplicity) {
        //             case Tigerian.Model.EOneToOne:
        //             case Tigerian.Model.EOneToStar:
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

        //         Object.defineProperty(this, name, {
        //             enumerable: false,
        //             configurable: false,
        //             get: function () {
        //                 return relations[name].value;
        //             },
        //         });
        //     }
        // };

        /**
         * @param {string} name
         */
        this.removeField = function (name) {
            if (name in fields) {
                delete fields[name];
                delete this[name];
            }
        };

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.update = function (success, unsuccess, progress) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);
            if (Tigerian.Class.isInstance(progress, "function")) {
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
        };

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.delete = function (success, unsuccess, progress) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);
            if (Tigerian.Class.isInstance(progress, "function")) {
                ajax.progress = progress;
            }

            if (fields["id"].value !== undefined) {
                ajax.url = getPath(deletePath);
                ajax.delete({
                    id: fields["id"].value
                }, ajaxSuccess, ajaxUnsuccess);
            }
        };

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.reload = function (success, unsuccess, progress) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);
            if (Tigerian.Class.isInstance(progress, "function")) {
                ajax.progress = progress;
            }

            if (fields["id"].value !== undefined) {
                ajax.url = getPath(reloadPath);
                ajax.get({
                    id: fields["id"].value
                });
            }
        };

        /**
         * @param {{}} options
         * @param {function} success
         * @param {function} unsuccess
         */
        this.search = function (options, success, unsuccess, progress) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSearchSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);
            if (Tigerian.Class.isInstance(progress, "function")) {
                ajax.progress = progress;
            }

            var params = (((options !== undefined) && (typeof options === "object")) ? {
                options: options
            } : {});
            for (var field in fields) {
                if (fields[field].value !== undefined) {
                    if (field !== "id") {
                        params[field] = fields[field].value;
                    }
                }
            }

            ajax.url = getPath(searchPath);
            ajax.get(params, ajaxSearchSuccess, ajaxUnsuccess);
        };

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.count = function (success, unsuccess, progress) {
            var ajax = new Tigerian.Ajax();
            ajax.success = function (text, xml, json) {
                if (Tigerian.Class.isInstance(success, "function")) {
                    success(json["count"]);
                }
            };
            ajax.unsuccess = ajaxUnsuccess(unsuccess);
            if (Tigerian.Class.isInstance(progress, "function")) {
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
        };

        this.toJSON = function () {
            var result = {};
            for (var field in fields) {
                result[field] = fields[field].value;
            }

            return result;
        };
    },
    enums: ["oneToOne", "oneToStar"],
});