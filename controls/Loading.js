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

        this.setAttribute("state", "indeterminate");

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
                    if (this.state === Tigerian.Loading.EDeterminate) {
                        elmBar.style.width = "{}%".format(v);
                    } else {
                        elmBar.style.width = "";
                    }
                }
            }
        });

        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            get: function () {
                return ((elmBar.getAttribute("state") === "determinate") ? Tigerian.Loading.EDeterminate : Tigerian.Loading.EIndeterminate);
            },
            set: function (v) {
                switch (v) {
                    case Tigerian.Loading.EDeterminate:
                        this.setAttribute("state", "determinate");
                        elmBar.style.width = "{}%".format(loaded);
                        break;

                    case Tigerian.Loading.EIndeterminate:
                        this.setAttribute("state", "indeterminate");
                        elmBar.style.width = "";
                        break;

                    default:
                }
            }
        });

        delete this.addControl;
    },
    enums: ["indeterminate", "determinate"],
}, Tigerian.BFixElement, Tigerian.BModal);