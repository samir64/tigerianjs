"use strict";

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 */
Tigerian.BCancel = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("cancel");

        var cancelButton = true;

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "cancelButton", {
            enumerable: true,
            configurable: true,
            get: function () {
                return cancelButton;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    cancelButton = v;
                }
            }
        });
    },
    /**
     * @param {string} behavior
     * @param {Tigerian.Control} ctrlCancel
     * @param {Tigerian.Control} btnCancelParent
     */
    config: function (behavior, ctrlCancel, btnCancelParent) {
        if (behavior === "cancel") {
            if (!Tigerian.Class.isInstance(ctrlCancel, Tigerian.Control)) {
                btnCancelParent = this;
            }

            if (!(Tigerian.Class.isInstance(ctrlCancel, Tigerian.Control) && ctrlCancel["Behavior:cancel"])) {
                ctrlCancel = this;
            }

            if (Tigerian.Class.isInstance(ctrlCancel, Tigerian.Control) && ctrlCancel["Behavior:cancel"]) {
                var initCancelButton = Object.getOwnPropertyDescriptor(this, "cancelButton");
                var instance = this;

                var elmButton = document.createElement("div");

                elmButton.setAttribute("element-type", "Button");
                elmButton.setAttribute("element-name", "cancel");

                btnCancelParent.addControl(elmButton);

                /**
                 * @member {boolean}
                 */
                Object.defineProperty(this, "cancelButton", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return (ctrlCancel.getAttribute("cancel-button") === "true");
                    },
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "boolean")) {
                            ctrlCancel.setAttribute("cancel-button", (v ? "true" : "false"));
                            elmButton.setAttribute("visible", (v ? "true" : "false"));
                        }
                    }
                });

                this.cancelButton = initCancelButton.get.bind(this)();

                elmButton.addEventListener("click", function (e) {
                    instance.visible = false;
                }, true);
            }
        }
    },
});