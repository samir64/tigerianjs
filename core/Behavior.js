'use strict';

/**
 * @param {string} behavior
 */
Tigerian.Behavior = Tigerian.Class.extend({
    init: function (behavior) {
        this.super();

        Object.defineProperty(this, "Behavior:" + behavior, {
            enumerable: false,
            writable: false,
            configurable: false,
            value: true,
        });
    },
});