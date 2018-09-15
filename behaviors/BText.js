/**
 * Created by samir on 9/14/16.
 */

'use strict';


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
    config: function (behavior, elmText) {
        if ((behavior === "text") && (Tigerian.Class.isInstance(elmText, Element) || (Tigerian.Class.isInstance(elmText, Tigerian.Control) && elmText["Behavior:text"]))) {
            this.setAttribute("text", this.text);
            elmText.innerHTML = this.text;
            elmText.value = this.text;

            function changeText(e) {
                if (elmText["Behavior:text"]) {
                    this.text = elmText.text;
                } else {
                    this.text = (Tigerian.Class.isInstance(e.target.value, "string") ? e.target.value : e.target.innerHTML);
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

                    if (elmText["Behavior:text"]) {
                        result = elmText.text;
                    } else if (Tigerian.Class.isInstance(elmText.value, "string")) {
                        result = elmText.value;
                    } else if (Tigerian.Class.isInstance(elmText.innerHTML, "string")) {
                        result = elmText.innerHTML;
                    } else {
                        result = this.getAttribute("text");
                    }

                    this.setAttribute("text", result);

                    return result;
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, "string")) {
                        this.setAttribute("text", v);
                        if (elmText["Behavior:text"]) {
                            this.text = v;
                        } else {
                            elmText.innerHTML = v;
                            elmText.value = v;
                        }
                    }
                },
            });

            elmText.addEventListener("change", changeText.bind(this));
            elmText.addEventListener("input", changeText.bind(this));
        }
    },
});