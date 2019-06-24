/**
 * Created by samir on 8/31/18.
 */

("use strict");

/**
 * @extends {Class}
 * @constructor
 */
GridTemplateItem = Class.extend({
    /**
     * @constructs
     * @param {string} name
     * @param {number} colSpan
     */
    init: function (name, colSpan) {
        if (Class.isInstance(name, "string")) {
            this.super();

            if (Class.isInstance(colSpan, "number")) {
                colSpan = Math.max(1, Math.abs(colSpan));
            } else {
                colSpan = 1;
            }

/*
            if (Class.isInstance(rowSpan, "number")) {
                rowSpan = Math.min(1, Math.abs(rowSpan));
            } else {
                rowSpan = 1;
            }
*/

            /**
             * @member {string}
             */
            Object.defineProperty(this, "name", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return name;
                },
                set: function (v) {
                    if (Class.isInstance(v, "string")) {
                        name = v;
                    }
                }
            });

            /**
             * @member {number}
             */
            Object.defineProperty(this, "colSpan", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return colSpan;
                },
                set: function (v) {
                    if (Class.isInstance(v, "number")) {
                        colSpan = v;
                    }
                }
            });

/*
            Object.defineProperty(this, "rowSpan", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return rowSpan;
                },
                set: function (v) {
                    if (Class.isInstance(v, "rowSpan")) {
                        rowSpan = v;
                    }
                }
            });
*/
        }
    }
});
