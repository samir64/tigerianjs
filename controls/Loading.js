"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BFixElement}
 * @implements {Tigerian.BModal}
 */
Tigerian.Loading = Tigerian.Control.extend({
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("fix_element", Tigerian.BFixElement.ETop);
        this.config("modal", parent);

        var elmBar = document.createElement("div");

        this.setAttribute("element-type", "Loading");
        this.setAttribute("element-name", "container");

        elmBar.setAttribute("element-type", "Loading");
        elmBar.setAttribute("element-name", "bar");
        elmBar.setAttribute("loaded", "0");

        this.addControl(elmBar);

        this.status = Tigerian.BModal.EClose;
        this.fixed = true;

        delete this.addControl;
    },
}, Tigerian.BFixElement, Tigerian.BModal);