"use strict";

Tigerian.BLabel = Tigerian.Behavior.extend({
    init: function () {
        this.super("label");

        var labelType = Tigerian.BLabel.ENone;

        Object.defineProperty(this, "labelType", {
            enumerable: true,
            configurable: true,
            get: function () {
                return labelType;
            },
            set: function (v) {
                switch (v) {
                    case Tigerian.BLabel.ETag:
                    case Tigerian.BLabel.EBadge:
                    case Tigerian.BLabel.ENone:
                        labelType = v;
                        break;

                    default:
                        labelType = Tigerian.BLabel.ENone;
                }
            }
        });
    },
    /**
     * @param {string} behavior
     * @param {Tigerian.Control} ctrlLabel
     */
    config: function (behavior, ctrlLabel) {
        if (behavior === "label") {
            if (!(Tigerian.Class.isInstance(ctrlLabel, Tigerian.Control) && ctrlLabel["Behavior:text"] && ctrlLabel["Behavior:label"])) {
                ctrlLabel = this;
            }

            if (Tigerian.Class.isInstance(ctrlLabel, Tigerian.Control) && ctrlLabel["Behavior:text"] && ctrlLabel["Behavior:label"]) {
                var initLabelType = Object.getOwnPropertyDescriptor(ctrlLabel, "labelType");

                this.setAttribute("label-type", "");

                /**
                 * @member {boolean}
                 */
                Object.defineProperty(this, "labelType", {
                    enumerable: true,
                    configurable: true,
                    get: initLabelType.get.bind(this),

                    set: function (v) {
                        switch (v) {
                            case Tigerian.BLabel.ETag:
                                this.setAttribute("label-type", "tag");
                                break;
                            case Tigerian.BLabel.EBadge:
                                this.setAttribute("label-type", "badge");
                                break;
                            case Tigerian.BLabel.ENone:
                            default:
                                this.setAttribute("label-type", "");
                        }

                        initLabelType.set.bind(this)(v);
                    }
                });
            }
        }
    },
    enums: ["none", "tag", "badge"],
});