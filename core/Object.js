'use strict';

/**
 * @param {Function(item, index, list)} callback
 */
Object.defineProperty(Object.prototype, "forEach", {
    value: function (callback) {
        if (callback instanceof Function) {
            for (var index in this) {
                callback(this[index], index, this);
            }
        }
    },
    writable: false,
    configurable: true,
    enumerable: false,
});