'use strict';

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 * @interface
 */
Tigerian.BIterator = Tigerian.Behavior.extend({
    init: function () {
        this.super("iterator");
    },

    /**
     * @constructs
     * @param {string} behavior
     * @param {{list: Array, currentIndex: number, value: *, done: boolean}} params
     */
    config: function (behavior, params) {
        if (behavior === "iterator") {
            var idx = (((params.currentIndex != undefined) && (typeof params.currentIndex == "number")) ? Math.max(0, Math.min(params.list.length, params.currentIndex)) : 0);
            if ((params.list == undefined) || (!(params.list instanceof Array))) {
                params.list = [];
            }

            var yieldFunc = function (i) {
                return params.list[i];
            };

            // yieldFunc();

            /**
             * @member {number}
             * @readonly
             */
            Object.defineProperty(this, "index", {
                enumarable: true,
                configurable: true,
                get: function () {
                    return idx;
                },
            });

            /**
             * @member {Array}
             * @readonly
             */
            // Object.defineProperty(this, "items", {
            //     enumarable: false,
            //     configurable: true,
            //     get: function () {
            //         return params.list;
            //     },
            // });

            /**
             * @member {Function}
             */
            Object.defineProperty(this, "yield", {
                enumerable: false,
                configurable: true,
                get: function () {
                    params.value = yieldFunc.bind(this)(idx);
                    params.index = idx;
                    params.done = this.done;
                    if (!params.done) {
                        params.list[idx] = params.value;
                    }

                    return params.value;
                },
                set: function (v) {
                    if (v instanceof Function) {
                        yieldFunc = v;
                    }
                },
            });

            /**
             * @member {*}
             * @readonly
             */
            Object.defineProperty(this, "value", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this.yield;
                },
            });

            /**
             * @member {boolean}
             * @readonly
             */
            Object.defineProperty(this, "done", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return (idx >= params.list.length);
                },
            });

            var getItem = function () {
                var result = {
                    value: this.yield,
                    index: idx,
                    done: this.done,
                };
                if (idx > params.list.length) {
                    idx = params.list.length;
                }
                return result;
            }.bind(this);

            /**
             * @returns {{value: *, done:boolean}}
             */
            this.next = function () {
                idx++;
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
                idx = params.list.length - 1;
                return getItem();
            };

            /**
             * @param {Function(item, index, list)} callback
             */
            Object.defineProperty(this, "forEach", {
                value: function (callback) {
                    if (callback instanceof Function) {
                        for (var item = this.first(); !item.done; item = this.next()) {
                            callback(item.value, item.index, params.list);
                        }
                    }
                },
                writable: false,
                configurable: true,
                enumerable: false,
            });

            this.yield;
        }
    },
});