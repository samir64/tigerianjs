("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 */
TableCell = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} text = ""
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        var elmText = document.createElement("div");
        this.super(parent, theme);
        this.config("text", elmText);

        var superAddControl = this.addControl;

        this.text = text;
        this.addControl(elmText);

        this.setAttribute("element-type", "TableCell");
        this.setAttribute("element-name", "container");

        elmText.setAttribute("element-type", "TableCell");
        // elmText.setAttribute("element-name", "text");

        this.situation = Control.ETransparent;
    },
}, BText);