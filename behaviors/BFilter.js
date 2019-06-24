/**
 * Created by samir on 9/14/16.
 */

("use strict");


/**
 * @implements {Behavior}
 * @extends {Control}
 * @interface
 */
BFilter = Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("filter");

        var filtering = false;

        /**
         * @member {boolean}
         * @this {Control}
         */
        Object.defineProperty(this, "filtering", {
            enumerable: true,
            configurable: true,
            get: function () {
                return filtering;
            },
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    filtering = v;
                }
            },
        });
    },
    /**
     * @param {string} behavior
     * @param {Control} ctrlText
     * @param {Control} ctrlList
     */
    config: function (behavior, ctrlText, ctrlList) {
        if (behavior === "filter") {
            if (!(Class.isInstance(ctrlList, Control) && ctrlList["Behavior:group"])) {
                ctrlList = this;
            }

            if (Class.isInstance(ctrlList, Control) && ctrlList["Behavior:group"] && Class.isInstance(ctrlText, Control) && ctrlText["Behavior:text"]) {
                var instance = this;
                this.setAttribute("filtering", ctrlList.filter ? "true" : "false");

                /**
                 * @param {string} text
                 */
                this.filter = function (text) {
                    if (!Class.isInstance(text, "string")) {
                        text = ctrlText.text;
                    }

                    if (this.filtering) {
                        /* for (var i = 0; i < ctrlList.itemCount; i++) {
                            ctrlList.getItem(i).visible = ((text === "") || ctrlList.getItem(i).text.toLowerCase().includes(text.toLowerCase()));
                        } */
                        ctrlList.forEach(function (item) {
                            item.visible = ((text === "") || item.text.toLowerCase().includes(text.toLowerCase()));
                        });
                    }
                };

                /**
                 * @member {boolean}
                 * @this {Control}
                 */
                Object.defineProperty(this, "filtering", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return (this.getAttribute("filtering") === "true");
                    },
                    set: function (v) {
                        if (Class.isInstance(v, "boolean")) {
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