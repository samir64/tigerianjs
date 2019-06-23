/**
 * Created by samir on 9/14/16.
 */

("use strict");


/**
 * @implements {Tigerian.Behavior}
 * @extends {Tigerian.Control}
 * @interface
 */
Tigerian.BText = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("text");

        var text = "";

        /**
         * @member {string}
         */
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            get: function () {
                return text;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    text = v;
                }
            },
        });
    },
    /**
     * @param {string} behavior
     * @param {Element|Tigerian.Control} ctrlText
     */
    config: function (behavior, ctrlText) {
        if ((behavior === "text") && (Tigerian.Class.isInstance(ctrlText, Element) || (Tigerian.Class.isInstance(ctrlText, Tigerian.Control) && ctrlText["Behavior:text"]))) {
            this.setAttribute("text", this.text);
            ctrlText.innerHTML = this.text;
            ctrlText.value = this.text;

            if (Tigerian.Class.isInstance(ctrlText, Element)) {
                ctrlText.setAttribute("element-name", "text");
            }

            var instance = this;

            function changeText(e) {
                if (ctrlText["Behavior:text"]) {
                    instance.text = ctrlText.text;
                } else {
                    instance.text = (Tigerian.Class.isInstance(e.target.value, "string") ? e.target.value : e.target.innerHTML);
                }
            }

            /**
             * @member {string}
             */
            Object.defineProperty(this, "text", {
                enumerable: true,
                configurable: true,
                get: function () {
                    var result;

                    if (ctrlText["Behavior:text"]) {
                        result = ctrlText.text;
                    } else if (Tigerian.Class.isInstance(ctrlText.value, "string")) {
                        result = ctrlText.value;
                    } else if (Tigerian.Class.isInstance(ctrlText.innerHTML, "string")) {
                        result = ctrlText.innerHTML;
                    } else {
                        result = this.getAttribute("text");
                    }

                    this.setAttribute("text", result);

                    return result;
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, "string")) {
                        var lastText = this.getAttribute("text");
                        this.setAttribute("text", v);
                        if (ctrlText["Behavior:text"]) {
                            ctrlText.text = v;
                        } else {
                            ctrlText.innerHTML = v;
                            ctrlText.value = v;
                        }

                        if (lastText !== v) {
                            this.dispatchEvent(Tigerian.Event.onTextChange, {
                                lastValue: lastText
                            });
                        }
                    }
                },
            });

            if (Tigerian.Class.isInstance(ctrlText, Tigerian.Control)) {
                ctrlText.addEvent("change", changeText);
                ctrlText.addEvent("input", changeText);
            } else {
                ctrlText.addEventListener("change", changeText);
                ctrlText.addEventListener("input", changeText);
            }
        }
    },
});