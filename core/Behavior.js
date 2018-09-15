'use strict';

/**
 * @namespace {Tigerian}
 * @interface
 * @extends {Tigerian.Class}
 */
Tigerian.Behavior = Tigerian.Class.extend({
    /**
     * @constructs
     * @param {string} behavior
     */
    init: function (behavior) {
        if (Tigerian.Class.isInstance(behavior, "string") && (behavior !== "")) {
            this.super();

            Object.defineProperty(this, "Behavior:" + behavior, {
                enumerable: true,
                writable: false,
                configurable: false,
                value: true,
            });
        }
    },
});