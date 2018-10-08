/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @extends {Tigerian.Control}
 * @constructor
 */
Tigerian.Button = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} text = ""
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        this.super(parent, theme);


        //NOTE Private Variables
        var elmButton = document.createElement("div");


        //NOTE Attributes
        this.setAttribute("element-type", "Button");
        this.setAttribute("element-name", "container");

        elmButton.setAttribute("element-type", "Button");
        elmButton.setAttribute("element-name", "text");

        this.setAttribute("fit-content", "false");


        if (Tigerian.Class.isInstance(text, "string")) {
            elmButton.innerHTML = text;
        }

        //NOTE Append Children
        this.addControl(elmButton);
        this.hoverable = true;


        //NOTE Properties
        /**
         * @member {string}
         */
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmButton.innerHTML;
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmButton.innerHTML = value;
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
                return elmButton.hasAttribute("tabindex") ? elmButton.getAttribute("tabindex") : 0;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number")) {
                    if (v > 0) {
                        elmButton.setAttribute("tabindex", v);
                    } else {
                        elmButton.removeAttribute("tabindex");
                    }
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "fitContent", {
            enumerable: true,
            configerable: true,
            get: function () {
                return this.getAttribute("fit-content")
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    this.setAttribute("fit-content", (v ? "true" : "false"));
                }
            }
        });

        this.select = function () {
            elmButton.focus();
        };


        window.addEventListener("keypress", function (e) {
            if (this.default && !e.ctrlKey && !e.altKey && !e.shiftKey && (e.code === "Enter") && (document.activeElement.getAttribute("element-type") !== "Button")) {
                elmButton.click(this);
            }
        }.bind(this), true);

        this.addEvent("keypress", function (e) {
            if (!e.ctrlKey && !e.altKey && !e.shiftKey && ((e.code === "Enter") || (e.code === "Space"))) {
                elmButton.click(this);
            }
        }.bind(this), true);

        delete this.addControl;
    }
});