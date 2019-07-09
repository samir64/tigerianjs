import {
    instanceOf
} from "../core/Tigerian.js";
import {
    Behavior
} from "../core/Behavior.js";

("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
export class BCancel extends Behavior {
    /**
     * @constructs
     */
    constructor() {
        super();

        /**
         * @param {string} behavior
         * @param {Control} ctrlCancel
         * @param {Control} btnCancelParent
         */
        this.defineMethod("config", (that, ctrlCancel, btnCancelParent) => {
            var cancelButton = true;
            var elmButton = document.createElement("div");

            elmButton.setAttribute("element-type", "Button");
            elmButton.setAttribute("element-name", "cancel");

            btnCancelParent.addControl(elmButton);
            /**
             * @member {boolean}
             */
            Object.defineProperty(that, "cancelButton", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return (ctrlCancel.getAttribute("cancel-button") === "true");
                },
                set: function (v) {
                    if (instanceOf(v, "boolean")) {
                        ctrlCancel.setAttribute("cancel-button", (v ? "true" : "false"));
                        elmButton.setAttribute("visible", (v ? "true" : "false"));
                    }
                }
            });

            elmButton.addEventListener("click", function (e) {
                that.visible = false;
            }, true);
        }, [Object, Control, Control]);
    }
}