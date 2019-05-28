"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BGroup}
 * @implements {Tigerian.BTable}
 */
Tigerian.TableBody = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("group");

        this.setAttribute("element-type", "TableBody");
        this.setAttribute("element-name", "container");
    }
}, Tigerian.BGroup, Tigerian.BTable);