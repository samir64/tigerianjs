/**
 * Created by samir on 11/10/16.
 */

("use strict");


/**
 * @extends {ListBox}
 * @implements {BFilter}
 * @constructor
 */
FilterList = ListBox.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        var ctrlFilter = new TextBox(null, "", this.theme);
        this.config("filter", ctrlFilter);
        this.addGeneralControl(ctrlFilter);

        this.filtering = true;

        this.setAttribute("element-type", "FilterList");
        this.setAttribute("element-name", "container");
    },
}, BFilter);