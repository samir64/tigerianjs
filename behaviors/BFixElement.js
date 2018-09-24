/**
 * Created by samir on 09/20/18.
 */

"use strict";

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 */
Tigerian.BFixElement = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("fix_element");

        Object.defineProperty(this, "fixed", {
            enumerable: true,
            configurable: true,
            value: false,
        });
    },
    config: function (behavior, stick, ctrlFix) {
        if (behavior === "fix_element") {
            if (!(Tigerian.Class.isInstance(ctrlFix, Tigerian.Control) && ctrlFix["Behavior:fix_element"])) {
                ctrlFix = this;
            }

            if (Tigerian.Class.isInstance(ctrlFix, Tigerian.Control) && ctrlFix["Behavior:fix_element"]) {
                switch (stick.toLowerCase()) {
                    case "top":
                        ctrlFix.setAttribute("stick", "top");
                        break;

                    case "bottom":
                        ctrlFix.setAttribute("stick", "bottom");
                        break;

                    default:
                        ctrlFix.setAttribute("stick", "none");
                }

                ctrlFix.setAttribute("fixed", this.fixed ? "true" : "false");

                Object.defineProperty(this, "fixed", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return (ctrlFix.getAttribute("fixed") === "true");
                    },
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "boolean")) {
                            // ctrlSpacer.visible = v;
                            ctrlFix.setAttribute("fixed", (v === true) ? "true" : "false");
                        }
                    },
                });

                this.addControl = ctrlFix.addControl;
            }
        }
    },
});