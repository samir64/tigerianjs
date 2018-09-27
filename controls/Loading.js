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
        var loaded = 0;

        this.setAttribute("element-type", "Loading");
        this.setAttribute("element-name", "container");

        elmBar.setAttribute("element-type", "Loading");
        elmBar.setAttribute("element-name", "bar");

        this.addControl(elmBar);

        this.status = Tigerian.BModal.EClose;
        this.fixed = true;

        Object.defineProperty(this, "loaded", {
            enumerable: true,
            configurable: true,
            get: function () {
                return loaded;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number")) {
                    v = Math.max(0, Math.min(100, v));
                    loaded = v;
                    elmBar.style.width = "{}%".format(v);
                }
            }
        });

        delete this.addControl;
    },
}, Tigerian.BFixElement, Tigerian.BModal);