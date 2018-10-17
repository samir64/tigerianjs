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
    config: function (behavior, ctrlClose, btnCloseParent) {
        if (behavior === "cancel") {
            if (!Tigerian.Class.isInstance(ctrlClose, Tigerian.Control)) {
                btnCloseParent = this;
            }

            if (!(Tigerian.Class.isInstance(ctrlClose, Tigerian.Control) && ctrlClose["Behavior:cancel"])) {
                ctrlClose = this;
            }

            if (Tigerian.Class.isInstance(ctrlClose, Tigerian.Control) && ctrlClose["Behavior:cancel"]) {
                var initClosButton = Object.getOwnPropertyDescriptor(this, "cancelButton");
                var instance = this;

                var elmButton = document.createElement("div");

                elmButton.setAttribute("element-type", "Button");
                elmButton.setAttribute("element-name", "cancel");

                btnCloseParent.addControl(elmButton);

                /**
                 * @member {boolean}
                 */
                Object.defineProperty(this, "cancelButton", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return (ctrlClose.getAttribute("cancel-button") === "true");
                    },
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "boolean")) {
                            ctrlClose.setAttribute("cancel-button", (v ? "true" : "false"));
                            elmButton.setAttribute("visible", (v ? "true" : "false"));
                        }
                    }
                });

                this.cancelButton = initClosButton.get.bind(this)();

                elmButton.addEventListener("click", function (e) {
                    instance.visible = false;
                }, true);
            }
        }
    },
});