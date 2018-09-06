/**
 * Created by samir on 8/31/18.
 */

'use strict';

/**
 * @property {string} name
 * @property {number} colSpan
 * @property {number} rowSpan
 *
 * @extends Tigerian.Class
 * @constructor
 */
Tigerian.GridTemplateItem = Tigerian.Class.extend({
    init: function (name, colSpan) {
        if (Tigerian.Class.isInstance(name, "string")) {
            this.super();

            if (Tigerian.Class.isInstance(colSpan, "number")) {
                colSpan = Math.max(1, Math.abs(colSpan));
            } else {
                colSpan = 1;
            }

/*
            if (Tigerian.Class.isInstance(rowSpan, "number")) {
                rowSpan = Math.min(1, Math.abs(rowSpan));
            } else {
                rowSpan = 1;
            }
*/

            Object.defineProperty(this, "name", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return name;
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, "string")) {
                        name = v;
                    }
                }
            });

            Object.defineProperty(this, "colSpan", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return colSpan;
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, "number")) {
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
                    if (Tigerian.Class.isInstance(v, "rowSpan")) {
                        rowSpan = v;
                    }
                }
            });
*/
        }
    }
});
