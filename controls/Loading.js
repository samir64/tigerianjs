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
        this.setAttribute("element-situation", "opposite");

        elmBar.setAttribute("element-type", "Loading");
        elmBar.setAttribute("element-name", "bar");
        elmBar.setAttribute("element-situation", "danger");

        this.setAttribute("state", "indeterminate");

        this.addControl(elmBar);

        this.status = Tigerian.BModal.EClose;
        this.fixed = true;

        /**
         * @member {number}
         */
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

        /**
         * @member {symbol}
         */
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            get: function () {
                var v = elmBar.getAttribute("state");
                switch (v) {
                    case "determinate":
                        return Tigerian.Loading.EDeterminate;

                    case "indeterminate":
                    default:
                        return Tigerian.Loading.EIndeterminate;
                }
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

        /**
         * @member {symbol}
         */
        Object.defineProperty(this, "barSituation", {
            enumerable: true,
            configurable: true,
            get: function () {
                var v = elmBar.getAttribute("element-situation");

                switch (v) {
                    case "title":
                        return Tigerian.Control.ETitle;

                    case "default":
                        return Tigerian.Control.EDefault;

                    case "transparent":
                        return Tigerian.Control.ETransparent;

                    case "opposite":
                        return Tigerian.Control.EOpposite;

                    case "warning":
                        return Tigerian.Control.EWarning;

                    case "danger":
                        return Tigerian.Control.EDanger;

                    case "disable":
                        return Tigerian.Control.EDisable;

                    case "ok":
                        return Tigerian.Control.EOk;

                    default:
                        return Tigerian.Control.ENone;
                }
            },
            set: function (v) {
                switch (v) {
                    case Tigerian.Control.ETitle:
                        elmBar.setAttribute("element-situation", "title");
                        break;

                    case Tigerian.Control.EDefault:
                        elmBar.setAttribute("element-situation", "default");
                        break;

                    case Tigerian.Control.ETransparent:
                        elmBar.setAttribute("element-situation", "transparent");
                        break;

                    case Tigerian.Control.EOpposite:
                        elmBar.setAttribute("element-situation", "opposite");
                        break;

                    case Tigerian.Control.EWarning:
                        elmBar.setAttribute("element-situation", "warning");
                        break;

                    case Tigerian.Control.EDanger:
                        elmBar.setAttribute("element-situation", "danger");
                        break;

                    case Tigerian.Control.EDisable:
                        elmBar.setAttribute("element-situation", "disable");
                        break;

                    case Tigerian.Control.EOk:
                        elmBar.setAttribute("element-situation", "ok");
                        break;

                    case Tigerian.Control.ENone:
                    default:
                        elmBar.setAttribute("element-situation", "");
                        break;
                }
            }
        });

        delete this.addControl;
    },
    enums: ["indeterminate", "determinate"],
}, Tigerian.BFixElement, Tigerian.BModal);