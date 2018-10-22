/**
 * Created by samir on 8/27/18.
 */



'use strict';

/**
 * @extends {Tigerian.ModelView}
 * @constructor
 */
Tigerian.ModelField = Tigerian.ModelView.extend({
    /**
     * @constructs
     * @param {string} name
     * @param {string} type
     * @param {*} value
     */
    init: function (name, type, collection, value) {
        if (Tigerian.Class.isInstance(name, "string") && (name !== "")) {
            this.super();

            if (!(Tigerian.Class.isInstance(type, "string") || Tigerian.Class.isSubclass(type, Tigerian.Model))) {
                type = "string";
            }

            if (!Tigerian.Class.isInstance(value, type)) {
                value = undefined;
            }

            collection = ((collection === true) ? true : false);

            var setValue = function (v) {
                var val;
                if (Tigerian.Class.isInstance(v, type) || (v === undefined) || (Tigerian.Class.isInstance(v, "object") && Tigerian.Class.isSubclass(type, Tigerian.Model))) {
                    if (Tigerian.Class.isInstance(v, "object")) {
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
                        if (Tigerian.Class.isInstance(value, Array)) {
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
             * @member {string}
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
                    if (collection && Tigerian.Class.isInstance(v, Array)) {
                        for (var i = 0; i < v.length; i++) {
                            setValue(v[i]);
                        }
                    } else if (!collection && !Tigerian.Class.isInstance(v, Array)) {
                        setValue(v);
                    } else {
                        // NOTE: Nothing
                    }
                },
            });
        }
    },
});