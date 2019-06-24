/**
 * Created by samir on 8/26/16.
 */

("use strict");


/**
 * @extends {Control}
 * @implements {BText}
 * @constructor
 */
TextBox = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} [text = ""]
     * @param {string} [theme = ""]
     */
    init: function (parent, text, theme) {
        var elmText = document.createElement("input");
        this.super(parent, theme);
        this.config("text", elmText);

        var thisEnabled = Object.getOwnPropertyDescriptor(this, "enabled");
        var instance = this;


        //NOTE Attributes
        this.setAttribute("element-type", "TextBox");
        this.setAttribute("element-name", "container");

        elmText.setAttribute("element-type", "TextBox");
        // elmText.setAttribute("element-name", "input");
        // elmText.setAttribute("type", "headText");
        // if (!Class.isInstance(text, "string")) {
        //     text = "";
        // }
        // elmText.value = text;

        this.text = text;


        //NOTE Append Children
        this.addControl(elmText);


        //NOTE Public Properties
        /**
         * @member {string}
         */
        // Object.defineProperty(this, "text", {
        //     enumerable: true,
        //     configurable: true,
        //     get: function () {
        //         return elmText.value;
        //     },

        //     set: function (v) {
        //         if (Class.isInstance(v, "string")) {
        //             elmText.value = v;
        //         }
        //     }
        // });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            get: function () {
                return thisEnabled.get.bind(this)();
            },

            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    thisEnabled.set.bind(this)(v);
                    if (v === false) {
                        elmText.setAttribute("disabled", "true");
                    } else {
                        elmText.removeAttribute("disabled");
                    }
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "pattern", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmText.getAttribute("pattern");
            },

            set: function (v) {
                if (Class.isInstance(v, "string")) {
                    elmText.setAttribute("pattern", v);
                    this.checkValidity();
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "required", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmText.hasAttribute("required");
            },

            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    if (v === true) {
                        elmText.setAttribute("required", "true");
                    } else {
                        elmText.removeAttribute("required");
                    }

                    this.checkValidity();
                }
            }
        });

        /**
         * @member {number}
         */
        Object.defineProperty(this, "tabIndex", {
            enumerable: true,
            configerable: true,
            get: function () {
                return elmText.hasAttribute("tabindex") ? elmButton.getAttribute("tabindex") : 0;
            },
            set: function (v) {
                if (Class.isInstance(v, "number")) {
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

        /**
         * @return boolean
         */
        this.isValid = function () {
            this.setAttribute("validity", elmText.validity.valid);
            return elmText.validity.valid;
        };


        //NOTE Default Event
        this.addEvent("click", onClick);
        elmText.addEventListener("input", function (e) {
            this.isValid();
        }.bind(this), true);
        elmText.addEventListener("focus", function (e) {
            this.dispatchEvent(Events.onFocus);
        }.bind(this), true);
        elmText.addEventListener("blur", function (e) {
            this.dispatchEvent(Events.onBlur);
        }.bind(this), true);

        delete this.addControl;
    }
}, BText);