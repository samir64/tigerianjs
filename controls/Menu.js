("use strict");

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BGroup}
 */
Tigerian.Menu = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
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
            if (Tigerian.Class.isInstance(item, Tigerian.MenuItem) || Tigerian.Class.isInstance(item, Tigerian.Spacer)) {
                superAddItem(item);
            }
        };
    },
}, Tigerian.BGroup);