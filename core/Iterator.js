
'use strict';

/**
 * @constructor
 * @extends {Tigerian.Class}
 */
Tigerian.Iterator = Tigerian.Class.extend({
    /**
     * @constructs
     * @param {Array} list
     * @param {number} startIndex
     */
    init: function (list, startIndex) {
        // var list = Array.from(arguments);
        var idx = (((startIndex != undefined) && (typeof startIndex == "number")) ? startIndex : 0);
        if ((list == undefined) || (!(list instanceof Array))) {
            list = [];
        }

        var yieldFunc = function () {
            return list[idx];
        };

        yieldFunc();

        /**
         * @member {number}
         * @readonly
         */
        Object.defineProperty(this, "index", {
            enumarable: true,
            configurable: false,
            get: function () {
                return idx;
            },
        });

        /**
         * @member {Array}
         * @readonly
         */
        Object.defineProperty(this, "list", {
            enumarable: false,
            configurable: false,
            get: function () {
                return list;
            },
        });

        /**
         * @member {Function}
         */
        Object.defineProperty(this, "yield", {
            enumerable: false,
            configurable: false,
            get: function () {
                return yieldFunc;
            },
            set: function (value) {
                if (value instanceof Function) {
                    yieldFunc = value.bind(this);
                }
            },
        });

        /**
         * @member {*}
         * @readonly
         */
        Object.defineProperty(this, "value", {
            enumerable: false,
            configurable: false,
            get: function () {
                return yieldFunc.bind(this)();
            },
        });

        /**
         * @member {boolean}
         * @readonly
         */
        Object.defineProperty(this, "done", {
            enumerable: false,
            configurable: false,
            get: function () {
                return (idx >= list.length);
            },
        });

        var getItem = function () {
            return {
                value: yieldFunc.bind(this)(),
                done: idx >= list.length
            };
        }.bind(this);

        /**
         * @returns {{value: *, done:boolean}}
         */
        this.next = function () {
            yieldFunc();
            idx++;
            if (idx > list.length) {
                idx = list.length;
            }
            return getItem();
        };

        /**
         * @returns {{value: *, done:boolean}}
         */
        this.first = function () {
            idx = 0;
            return getItem();
        };

        /**
         * @returns {{value: *, done:boolean}}
         */
        this.last = function () {
            idx = list.length - 1;
            return getItem();
        };
    },
});