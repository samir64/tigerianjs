"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BGroup}
 * @implements {Tigerian.BTable}
 */
Tigerian.Table = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {number} colCount = 1
     * @param {string} caption = ""
     * @param {string} theme = ""
     */
    init: function (parent, colCount, caption, theme) {
        this.super(parent, theme);

        this.setAttribute("element-type", "Table");
        this.setAttribute("element-name", "container");

        var ctrlTableHeader = new Tigerian.Header(this, false, this.theme);
        var ctrlTableBody = new Tigerian.TableBody(this, this.theme);
        var ctrlCaption = new Tigerian.Label(ctrlTableHeader, "", this.theme);

        this.config("group", ctrlTableBody);
        this.config("table", colCount, ctrlTableBody);

        ctrlCaption.text = caption;

        /**
         * @member {string}
         */
        Object.defineProperty(this, "caption", {
            enumerable: true,
            configurable: true,
            get: function () {
                return ctrlCaption.text;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlCaption.text = v;
                }
            },
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "captionVisible", {
            enumerable: true,
            configurable: true,
            get: function () {
                return ctrlCaption.visible;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    ctrlCaption.visible = v;
                    inst
                }
            },
        });

        this.addControl = this.addItem = this.addRow;
        delete this.removeItem;
        // delete this.clear;
    },
}, Tigerian.BGroup, Tigerian.BTable);