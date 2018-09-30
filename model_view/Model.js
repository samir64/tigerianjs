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
     */
    init: function (applicationPath, controllerPath, idType) {
        this.super();

        /**
         * @type {Tigerian.ModelField[]}
         */
        var fields = {
            id: new Tigerian.ModelField("id", idType)
        };
        var addPath = controllerPath;
        var editPath = controllerPath;
        var deletePath = controllerPath;
        var reloadPath = controllerPath;
        var searchPath = controllerPath;
        var countPath = controllerPath;
        var constructorArgs = Array.from(arguments);

        var instance = this;

        var ajaxSuccess = function (successFunc, unsuccessFunc) {
            return function (text, xml, json) {
                if (json !== undefined) {
                    for (var field in json) {
                        if ((field in fields) && instance.hasOwnProperty(field)) {
                            fields[field].value = json[field];
                        }
                    }

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
                        rows.push(row);
                        for (var field in json[recordNo]) {
                            if ((field in fields) && instance.hasOwnProperty(field)) {
                                row[field] = json[recordNo][field];
                            }
                        }
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
                if (Tigerian.Class.isInstance(unsuccessFunc, "function")) {
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
         * @param {string} type
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
                })
            }
        };

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
                    if (field !== "id") {
                        params[field] = fields[field].value;
                    }
                }
            }

            if (fields["id"].value !== undefined) {
                ajax.url = applicationPath + editPath;
                params = {
                    id: fields["id"].value,
                    value: params
                };
                ajax.put(params);
            } else {
                ajax.url = applicationPath + addPath;
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
                ajax.url = applicationPath + deletePath;
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
                ajax.url = applicationPath + reloadPath;
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

            var params = (options ? {
                options: options
            } : {});
            for (var field in fields) {
                if (fields[field].value !== undefined) {
                    params[field] = fields[field].value;
                }
            }

            ajax.url = applicationPath + searchPath;
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

            ajax.url = applicationPath + countPath;
            ajax.get(params);
        };

        this.toJSON = function () {
            var result = {};
            for (var field in fields) {
                result[field] = fields[field].value;
                // if (Tigerian.Class.isInstance(fields[field], Tigerian.Model)) {
                //     result[field] = fields[field].toJSON();
                // } else {
                //     result[field] = fields[field].value;
                // }
            }

            return result;
        };
    },
});