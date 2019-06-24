/**
 * Created by samir on 9/14/16.
 */

("use strict");


/**
 * @implements {Behavior}
 * @extends {Control}
 * @interface
 */
BText = Behavior.extend({
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
                if (Class.isInstance(v, "string")) {
                    text = v;
                }
            },
        });
    },
    /**
     * @param {string} behavior
     * @param {Element|Control} ctrlText
     */
    config: function (behavior, ctrlText) {
        if ((behavior === "text") && (Class.isInstance(ctrlText, Element) || (Class.isInstance(ctrlText, Control) && ctrlText["Behavior:text"]))) {
            this.setAttribute("text", this.text);
            ctrlText.innerHTML = this.text;
            ctrlText.value = this.text;

            if (Class.isInstance(ctrlText, Element)) {
                ctrlText.setAttribute("element-name", "text");
            }

            var instance = this;

            function changeText(e) {
                if (ctrlText["Behavior:text"]) {
                    instance.text = ctrlText.text;
                } else {
                    instance.text = (Class.isInstance(e.target.value, "string") ? e.target.value : e.target.innerHTML);
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
                    } else if (Class.isInstance(ctrlText.value, "string")) {
                        result = ctrlText.value;
                    } else if (Class.isInstance(ctrlText.innerHTML, "string")) {
                        result = ctrlText.innerHTML;
                    } else {
                        result = this.getAttribute("text");
                    }

                    this.setAttribute("text", result);

                    return result;
                },
                set: function (v) {
                    if (Class.isInstance(v, "string")) {
                        var lastText = this.getAttribute("text");
                        this.setAttribute("text", v);
                        if (ctrlText["Behavior:text"]) {
                            ctrlText.text = v;
                        } else {
                            ctrlText.innerHTML = v;
                            ctrlText.value = v;
                        }

                        if (lastText !== v) {
                            this.dispatchEvent(Events.onTextChange, {
                                lastValue: lastText
                            });
                        }
                    }
                },
            });

            if (Class.isInstance(ctrlText, Control)) {
                ctrlText.addEvent("change", changeText);
                ctrlText.addEvent("input", changeText);
            } else {
                ctrlText.addEventListener("change", changeText);
                ctrlText.addEventListener("input", changeText);
            }
        }
    },
});