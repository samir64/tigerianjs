/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @param {string} [text = ""]
 * @param {string} [style = ""]
 * @param {Tigerian.Application|Tigerian.Control} [parent = undefined]
 * @param {Function|Function[]} [interfaces = undefined]
 *
 * @property {string} text
 *
 * @extends Tigerian.Control
 * @constructor
 */
Tigerian.TextBox = Tigerian.Control.extend({
    init: function (parent, text, theme) {
        this.super(parent, theme);


        //NOTE Private Variables
        var elmText = document.createElement("input");
        var thisEnabled = Object.getOwnPropertyDescriptor(this, "enabled");


        //NOTE Attributes
        this.setAttribute("element-name", "container");
        this.setAttribute("element-type", "TextBox");

        elmText.setAttribute("element-type", "TextBox");
        elmText.setAttribute("element-name", "input");
        // elmText.setAttribute("type", "headText");
        if (!Tigerian.Class.isInstance(text, "string")) {
            text = "";
        }
        elmText.value = text;


        //NOTE Append Children
        this.addControl(elmText);


        //NOTE Public Properties
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmText.value;
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmText.value = value;
                }
            }
        });

        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            get: function () {
                return thisEnabled.get.bind(this)();
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    thisEnabled.set.bind(this)(value);
                    if (value === false) {
                        elmText.setAttribute("disabled", "true");
                    } else {
                        elmText.removeAttribute("disabled");
                    }
                }
            }
        });

        Object.defineProperty(this, "pattern", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmText.getAttribute("pattern");
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmText.setAttribute("pattern", value);
                    this.checkValidity();
                }
            }
        });

        Object.defineProperty(this, "required", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmText.hasAttribute("required");
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    if (value === true) {
                        elmText.setAttribute("required", "true");
                    } else {
                        elmText.removeAttribute("required");
                    }

                    this.checkValidity();
                }
            }
        });

        Object.defineProperty(this, "tabIndex", {
            enumerable: true,
            configerable: true,
            get: function () {
                return elmText.hasAttribute("tabindex") ? elmButton.getAttribute("tabindex") : 0;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number")) {
                    if (v > 0) {
                        elmText.setAttribute("tabindex", v);
                    } else {
                        elmText.removeAttribute("tabindex");
                    }
                }
            }
        });

        //NOTE Private Functions
        function onClick(e) {
            elmText.focus();
        }


        //NOTE Public Functions
        this.select = function () {
            elmText.select();
        };

        this.checkValidity = function (e) {
            this.setAttribute("validity", elmText.validity.valid);
        };


        //NOTE Default Event
        this.addEvent("click", onClick);
        elmText.addEventListener("input", this.checkValidity.bind(this), true);

        delete this.addControl;
    }
});
