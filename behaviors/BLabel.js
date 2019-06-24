("use strict");

BLabel = Behavior.extend({
    init: function () {
        this.super("label");

        var labelType = BLabel.ENone;

        Object.defineProperty(this, "labelType", {
            enumerable: true,
            configurable: true,
            get: function () {
                return labelType;
            },
            set: function (v) {
                switch (v) {
                    case BLabel.ETag:
                    case BLabel.EBadge:
                    case BLabel.ENone:
                        labelType = v;
                        break;

                    default:
                        labelType = BLabel.ENone;
                }
            }
        });
    },
    /**
     * @param {string} behavior
     * @param {Control} ctrlLabel
     */
    config: function (behavior, ctrlLabel) {
        if (behavior === "label") {
            if (!(Class.isInstance(ctrlLabel, Control) && ctrlLabel["Behavior:text"] && ctrlLabel["Behavior:label"])) {
                ctrlLabel = this;
            }

            if (Class.isInstance(ctrlLabel, Control) && ctrlLabel["Behavior:text"] && ctrlLabel["Behavior:label"]) {
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
                            case BLabel.ETag:
                                this.setAttribute("label-type", "tag");
                                break;
                            case BLabel.EBadge:
                                this.setAttribute("label-type", "badge");
                                break;
                            case BLabel.ENone:
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