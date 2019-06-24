("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
BCancel = Behavior.extend({
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
                if (Class.isInstance(v, "boolean")) {
                    cancelButton = v;
                }
            }
        });
    },
    /**
     * @param {string} behavior
     * @param {Control} ctrlCancel
     * @param {Control} btnCancelParent
     */
    config: function (behavior, ctrlCancel, btnCancelParent) {
        if (behavior === "cancel") {
            if (!Class.isInstance(ctrlCancel, Control)) {
                btnCancelParent = this;
            }

            if (!(Class.isInstance(ctrlCancel, Control) && ctrlCancel["Behavior:cancel"])) {
                ctrlCancel = this;
            }

            if (Class.isInstance(ctrlCancel, Control) && ctrlCancel["Behavior:cancel"]) {
                var instance = this;
                var superClass = this.super;
                var initCancelButton = Object.getOwnPropertyDescriptor(superClass, "cancelButton");

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
                        if (Class.isInstance(v, "boolean")) {
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