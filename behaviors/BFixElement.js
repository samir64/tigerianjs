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
                // var ctrlSpacer = new Tigerian.Spacer(this, false, this.app);
                var ctrlContainer = new Tigerian.Control(this, this.app);

                switch (stick.toLowerCase()) {
                    case "top":
                        ctrlContainer.setAttribute("stick", "top");
                        break;

                    case "bottom":
                        ctrlContainer.setAttribute("stick", "bottom");
                        break;

                    default:
                        ctrlContainer.setAttribute("stick", "none");
                }

                ctrlContainer.setAttribute("fixed", this.fixed ? "true" : "false");

                Object.defineProperty(this, "fixed", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return (ctrlContainer.getAttribute("fixed") === "true");
                    },
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "boolean")) {
                            // ctrlSpacer.visible = v;
                            ctrlContainer.setAttribute("fixed", (v === true) ? "true" : "false");
                        }
                    },
                });

                this.addControl = ctrlContainer.addControl;
            }
        }
    },
});