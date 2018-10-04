"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 */
Tigerian.DataTable = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {number} colCount = 1
     * @param {string} caption = ""
     * @param {string} theme = ""
     */
    init: function (parent, colCount, caption, theme) {
        this.super(parent, theme);

        this.setAttribute("element-type", "DataTable");
        this.setAttribute("element-name", "container");

        var ctrlTableBody = new Tigerian.TableBody(this, this.theme);
        this.config("group");
        this.config("table", colCount, ctrlTableBody);

        this.addControl = this.addItem = this.addRow;
        delete this.removeItem;
        // delete this.clear;
    },
}, Tigerian.BGroup, Tigerian.BTable);