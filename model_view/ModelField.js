/**
 * Created by samir on 8/27/18.
 */



("use strict");

/**
 * @extends {ModelView}
 * @constructor
 */
ModelField = ModelView.extend({
    /**
     * @constructs
     * @param {string} name
     * @param {string} type = "string"
     * @param {boolean} collection = false
     * @param {*} value = undefined
     */
    init: function (name, type, collection, value) {
        if (Class.isInstance(name, "string") && (name !== "")) {
            this.super();

            if (!(Class.isInstance(type, "string") || Class.isSubclass(type, Model))) {
                type = "string";
            }

            if (!Class.isInstance(value, type)) {
                value = undefined;
            }

            collection = ((collection === true) ? true : false);

            var setValue = function (v) {
                var val;
                if (Class.isInstance(v, type) || (v === undefined) || (Class.isInstance(v, "object") && Class.isSubclass(type, Model))) {
                    if (Class.isInstance(v, "object")) {
                        val = new type();

                        for (var field in v) {
                            if (field in val) {
                                val[field] = v[field];
                            }
                        }
                    } else {
                        val = v;
                    }

                    if (collection) {
                        if (Class.isInstance(value, Array)) {
                            value.push(val);
                        } else {
                            value = [val];
                        }
                    } else {
                        value = val;
                    }
                }
            };

            /**
             * @member {string}
             */
            Object.defineProperty(this, "name", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: name,
            });

            /**
             * @member {string}
             */
            Object.defineProperty(this, "type", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: type,
            });

            /**
             * @member {boolean}
             */
            Object.defineProperty(this, "collection", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: collection,
            });

            /**
             * @member {*}
             */
            Object.defineProperty(this, "value", {
                enumerable: false,
                configurable: false,
                get: function () {
                    return value;
                },
                set: function (v) {
                    if (collection && Class.isInstance(v, Array)) {
                        for (var i = 0; i < v.length; i++) {
                            setValue(v[i]);
                        }
                    } else if (!collection && !Class.isInstance(v, Array)) {
                        setValue(v);
                    } else {
                        // NOTE: Nothing
                    }
                },
            });
        }
    },
});