/**
 * Created by samir on 8/27/18.
 */



'use strict';

/**
 * @extends Tigerian.ModelView
 * @constructor
 */
Tigerian.ModelField = Tigerian.ModelView.extend({
    init: function (name, type, value) {
        if (Tigerian.Class.isInstance(name, "string") && (name !== "")) {
            this.super();

            if (!Tigerian.Class.isInstance(type, "string")) {
                type = "string";
            }

            if (!Tigerian.Class.isInstance(value, type)) {
                value = undefined;
            }

            Object.defineProperty(this, "name", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: name,
            });

            Object.defineProperty(this, "type", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: type,
            });

            Object.defineProperty(this, "value", {
                enumerable: false,
                configurable: false,
                get: function () {
                    return value;
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, type) || (v === undefined)) {
                        value = v;
                    }
                },
            });
        }
    }
});
