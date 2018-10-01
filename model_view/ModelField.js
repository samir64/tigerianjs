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
    init: function (name, type, value) {
        if (Tigerian.Class.isInstance(name, "string") && (name !== "")) {
            this.super();

            if (!(Tigerian.Class.isInstance(type, "string") || Tigerian.Class.isSubclass(type, Tigerian.Model))) {
                type = "string";
            }

            if (!Tigerian.Class.isInstance(value, type)) {
                value = undefined;
            }

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
             * @member {*}
             */
            Object.defineProperty(this, "value", {
                enumerable: false,
                configurable: false,
                get: function () {
                    return value;
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, type) || (v === undefined) || (Tigerian.Class.isInstance(v, "object") && Tigerian.Class.isSubclass(type, Tigerian.Model))) {
                        if (Tigerian.Class.isInstance(v, "object")) {
                            value = new type();

                            for (var field in v) {
                                if (field in value) {
                                    value[field] = v[field];
                                }
                            }
                        } else {
                            value = v;
                        }
                    }
                },
            });
        }
    },
});