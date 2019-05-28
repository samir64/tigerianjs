'use strict';

/**
 * @param {Function} callback
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
    configurable: false,
    enumerable: false,
});