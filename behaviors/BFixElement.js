/**
 * Created by samir on 09/20/18.
 */

("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
BFixElement = Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("fix_element");

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "fixed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false,
        });
    },
    /**
     * @param {string} behavior
     * @param {boolean} stick
     * @param {Control} ctrlFix
     */
    config: function (behavior, stick, ctrlFix) {
        if (behavior === "fix_element") {
            if (!(Class.isInstance(ctrlFix, Control) && ctrlFix["Behavior:fix_element"])) {
                ctrlFix = this;
            }

            if (Class.isInstance(ctrlFix, Control) && ctrlFix["Behavior:fix_element"]) {
                switch (stick) {
                    case BFixElement.ETop:
                        ctrlFix.setAttribute("stick", "top");
                        break;

                    case BFixElement.EBottom:
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
                        if (Class.isInstance(v, "boolean")) {
                            // ctrlSpacer.visible = v;
                            ctrlFix.setAttribute("fixed", (v === true) ? "true" : "false");
                        }
                    },
                });

                this.addControl = ctrlFix.addControl;
            }
        }
    },
    enums: ["top", "bottom", "none"],
});