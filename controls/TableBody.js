("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 * @implements {BTable}
 */
TableBody = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("group");

        this.setAttribute("element-type", "TableBody");
        this.setAttribute("element-name", "container");
    }
}, BGroup, BTable);