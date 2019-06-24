("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 * @implements {BCancel}
 */
Notification = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} text = ""
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        var elmMessage = document.createElement("div");

        this.super(parent, theme);
        this.config("text", elmMessage);
        this.config("cancel");

        this.setAttribute("element-type", "Notification");
        this.setAttribute("element-name", "container");

        elmMessage.setAttribute("element-type", "Notification");
        // elmMessage.setAttribute("element-name", "message");

        this.addControl(elmMessage);
        this.text = text;
    },
}, BText, BCancel);