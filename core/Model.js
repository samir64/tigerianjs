/**
 * Created by samir on 8/27/18.
 */

'use strict';

/**
 * @param {string} applicationPath
 * @property {string} ctrlAdd
 * @property {string} ctrlEdit
 * @property {string} ctrlDelete
 * @property {string} ctrlRefresh
 * @property {string} ctrlSearch
 * @property {string} idType
 *
 * @extends Tigerian.ModelView
 * @constructor
 */
Tigerian.Model = Tigerian.ModelView.extend({
    /**
     * @param {string} applicationPath
     * @param {string} controllerPath
     * @param {string} idType
     */
    init: function (applicationPath, controllerPath, idType) {
        this.super();

        /**
         * @type {Tigerian.ModelField[]}
         */
        var fields = {id: new Tigerian.ModelField("id", idType)};
        var ctrlAdd = controllerPath;
        var ctrlEdit = controllerPath;
        var ctrlDelete = controllerPath;
        var ctrlRefresh = controllerPath;
        var ctrlSearch = controllerPath;
        var ctrlCount = controllerPath;

        var addField = function (name, type) {
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

        var removeField = function (name) {
            if (name in fields) {
                delete fields[name];
                delete this[name];
            }
        };

        var ajaxSuccess = function (successFunc, unsuccessFunc) {
            return function (text, xml, json) {
                if (json !== undefined) {
                    for (var field in json) {
                        if ((field in fields) && this.hasOwnProperty(field)) {
                            this[field] = json[field];
                        }
                    }

                    if (Tigerian.Class.isInstance(successFunc, "function")) {
                        successFunc();
                    }
                } else {
                    ajaxUnsuccess(unsuccessFunc)(4, 501, text);
                }
            }.bind(this)
        }.bind(this);


        var ajaxSearchSuccess = function (successFunc, unsuccessFunc) {
            return function (text, xml, json) {
                if (json !== undefined) {
                    var rows = [];
                    for (var recordNo in json) {
                        var row = new this.constructor();
                        rows.push(row);
                        for (var field in json[recordNo]) {
                            if ((field in fields) && this.hasOwnProperty(field)) {
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
            }.bind(this)
        }.bind(this);

        var ajaxUnsuccess = function(unsuccessFunc) {
            return function (readystate, status, statusText) {
                if (Tigerian.Class.isInstance(unsuccessFunc, "function")) {
                    unsuccessFunc(statusText);
                } else {
                    console.error(statusText);
                }
            }
        };

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

        Object.defineProperty(this, "addField", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: addField,
        });

        Object.defineProperty(this, "removeField", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: removeField,
        });

        Object.defineProperty(this, "ctrlAdd", {
            enumerable: true,
            configurable: false,
            get: function () {
                return ctrlAdd;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlAdd = v;
                }
            }
        });

        Object.defineProperty(this, "ctrlEdit", {
            enumerable: true,
            configurable: false,
            get: function () {
                return ctrlEdit;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlEdit = v;
                }
            }
        });

        Object.defineProperty(this, "ctrlDelete", {
            enumerable: true,
            configurable: false,
            get: function () {
                return ctrlDelete;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlDelete = v;
                }
            }
        });

        Object.defineProperty(this, "ctrlRefresh", {
            enumerable: true,
            configurable: false,
            get: function () {
                return ctrlRefresh;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlRefresh = v;
                }
            }
        });

        Object.defineProperty(this, "ctrlSearch", {
            enumerable: true,
            configurable: false,
            get: function () {
                return ctrlSearch;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlSearch = v;
                }
            }
        });

        Object.defineProperty(this, "ctrlCount", {
            enumerable: true,
            configurable: false,
            get: function () {
                return ctrlCount;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlCount = v;
                }
            }
        });

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.update = function (success, unsuccess) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);

            var params = {};
            for (var field in fields) {
                if (fields[field].value !== undefined) {
                    if (field !== "id") {
                        params[field] = fields[field].value;
                    }
                }
            }

            if (fields["id"].value !== undefined) {
                ajax.url = applicationPath + ctrlEdit;
                params = {id: fields["id"].value, value: params};
                ajax.put(params);
            } else {
                ajax.url = applicationPath + ctrlAdd;
                ajax.post(params);
            }
        };

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.delete = function (success, unsuccess) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);

            if (fields["id"].value !== undefined) {
                ajax.url = applicationPath + ctrlDelete;
                ajax.delete({id: fields["id"].value}, ajaxSuccess, ajaxUnsuccess);
            }
        };

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.refresh = function (success, unsuccess) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);

            if (fields["id"].value !== undefined) {
                ajax.url = applicationPath + ctrlRefresh;
                ajax.get({id: fields["id"].value});
            }
        };

        /**
         * @param {{}} options
         * @param {function} success
         * @param {function} unsuccess
         */
        this.search = function (options, success, unsuccess) {
            var ajax = new Tigerian.Ajax();
            ajax.success = ajaxSearchSuccess(success, unsuccess);
            ajax.unsuccess = ajaxUnsuccess(unsuccess);


            var params = {options: options};
            for (var field in fields) {
                if (fields[field].value !== undefined) {
                    params[field] = fields[field].value;
                }
            }

            ajax.url = applicationPath + ctrlSearch;
            ajax.get(params, ajaxSearchSuccess, ajaxUnsuccess);
        };

        /**
         * @param {function} success
         * @param {function} unsuccess
         */
        this.count = function (success, unsuccess) {
            var ajax = new Tigerian.Ajax();
            ajax.success = function (text, xml, json) {
                if (Tigerian.Class.isInstance(success, "function")) {
                    success(json["count"]);
                }
            };
            ajax.unsuccess = ajaxUnsuccess(unsuccess);


            var params = {options: {count: true}};
            for (var field in fields) {
                if (fields[field].value !== undefined) {
                    params[field] = fields[field].value;
                }
            }

            ajax.url = applicationPath + ctrlCount;
            ajax.get(params);
        };
    }
});
