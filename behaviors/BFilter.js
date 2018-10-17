/**
 * Created by samir on 9/14/16.
 */

'use strict';


/**
 * @implements {Tigerian.Behavior}
 * @extends {Tigerian.Control}
 * @interface
 */
Tigerian.BFilter = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("filter");

        var filtering = false;

        /**
         * @member {boolean}
         * @this {Tigerian.Control}
         */
        Object.defineProperty(this, "filtering", {
            enumerable: true,
            configurable: true,
            get: function () {
                return filtering;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    filtering = v;
                }
            },
        });
    },
    config: function (behavior, ctrlText, ctrlList) {
        if (behavior === "filter") {
            if (!(Tigerian.Class.isInstance(ctrlList, Tigerian.Control) && ctrlList["Behavior:group"])) {
                ctrlList = this;
            }

            if (Tigerian.Class.isInstance(ctrlList, Tigerian.Control) && ctrlList["Behavior:group"] && Tigerian.Class.isInstance(ctrlText, Tigerian.Control) && ctrlText["Behavior:text"]) {
                var instance = this;
                this.setAttribute("filtering", ctrlList.filter ? "true" : "false");

                this.filter = function (text) {
                    if (!Tigerian.Class.isInstance(text, "string")) {
                        text = ctrlText.text;
                    }

                    if (this.filtering) {
                        for (var i = 0; i < ctrlList.itemCount; i++) {
                            ctrlList.getItem(i).visible = ((text === "") || ctrlList.getItem(i).text.toLowerCase().includes(text.toLowerCase()));
                        }
                    }
                }

                /**
                 * @member {boolean}
                 * @this {Tigerian.Control}
                 */
                Object.defineProperty(this, "filtering", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return (this.getAttribute("filtering") === "true");
                    },
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "boolean")) {
                            this.setAttribute("filtering", (v === true) ? "true" : "false");
                            if (this !== ctrlList) {
                                ctrlList.filter = v;
                            }
                        }
                    },
                });

                ctrlText.addEvent("input", function (e) {
                    instance.filter();
                });

                this.filter();

                // ctrlText.addEvent("keydown", function (e) {
                //     switch (e.code) {
                //         case "Space":
                //             // this.text += " ";
                //             e.preventDefault();
                //     }
                // });
            }
        }
    },
});