("use strict");

/**
 * @constructor
 * @extends {Class}
 */
Iterator = Class.extend({
    /**
     * @constructs
     * @param {Array} list
     * @param {number} currentIndex
     * @param {Object} out
     */
    init: function (list, currentIndex, out) {
        this.super();

        if ((out === undefined) || (typeof out !== "object")) {
            out = {};
        }
        if (typeof currentIndex === "number") {
            out.currentIndex = currentIndex;
        }
        if (list instanceof Array) {
            out.list = list;
        }

        this.config("iterator", out);
    },
}, BIterator);