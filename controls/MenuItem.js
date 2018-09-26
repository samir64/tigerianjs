"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BText}
 * @implements {Tigerian.BCascade}
 */
Tigerian.MenuItem = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} text
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        this.super(parent, theme);

        var elmText = document.createElement("div");
        this.addControl(elmText);

        this.config("text", elmText);
        this.config("cascade");

        var openByClick = false;

        var instance = this;
        // var superAddControl = this.addControl;

        this.text = text;

        this.setAttribute("element-type", "MenuItem");
        this.setAttribute("element-name", "container");

        elmText.setAttribute("element-type", "MenuItem");
        elmText.setAttribute("element-name", "text");

        this.addEvent("mouseover", function (e) {
            instance.viewChild(true);
        });
        this.addEvent("mouseleave", function (e) {
            instance.viewChild(false);
        });

        elmText.addEventListener("touchend", function (e) {
            instance.viewChild();
        });
    },
}, Tigerian.BText, Tigerian.BCascade);