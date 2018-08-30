
'use strict';

/**
 * @property {number} index
 * @property {Array} list
 * @property {Function} yield
 */
Tigerian.Iterator = Tigerian.Class.extend({
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

        Object.defineProperty(this, "index", {
            enumarable: true,
            configurable: false,
            get: function () {
                return idx;
            },
        });

        Object.defineProperty(this, "list", {
            enumarable: false,
            configurable: false,
            get: function () {
                return list;
            },
        });

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

        Object.defineProperty(this, "value", {
            enumerable: false,
            configurable: false,
            get: function () {
                return yieldFunc.bind(this)();
            },
        });

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

        this.next = function () {
            yieldFunc();
            idx++;
            if (idx > list.length) {
                idx = list.length;
            }
            return getItem();
        };

        this.first = function () {
            idx = 0;
            return getItem();
        };

        this.last = function () {
            idx = list.length - 1;
            return getItem();
        };
    },
});