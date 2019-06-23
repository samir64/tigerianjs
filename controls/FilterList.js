/**
 * Created by samir on 11/10/16.
 */

("use strict");


/**
 * @extends {Tigerian.ListBox}
 * @implements {Tigerian.BFilter}
 * @constructor
 */
Tigerian.FilterList = Tigerian.ListBox.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        var ctrlFilter = new Tigerian.TextBox(null, "", this.theme);
        this.config("filter", ctrlFilter);
        this.addGeneralControl(ctrlFilter);

        this.filtering = true;

        this.setAttribute("element-type", "FilterList");
        this.setAttribute("element-name", "container");
    },
}, Tigerian.BFilter);