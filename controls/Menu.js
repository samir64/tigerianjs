("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 */
Menu = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("group");

        var superAddControl = this.addControl.bind(this);
        var superAddItem = this.addItem.bind(this);

        this.setAttribute("element-type", "Menu");
        this.setAttribute("element-name", "container");

        /**
         * @param {Tigeriam.MenuItem} item
         */
        this.addControl = this.addItem = function (item) {
            if (Class.isInstance(item, MenuItem) || Class.isInstance(item, Spacer)) {
                superAddItem(item);
            }
        };
    },
}, BGroup);