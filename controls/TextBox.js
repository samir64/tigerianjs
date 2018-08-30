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

        elmText.setAttribute("element-type", "Element");
        elmText.setAttribute("element-name", "text-box");
        elmText.setAttribute("type", "headText");
        if (!Tigerian.Class.isInstance(text, "string")) {
            text = "";
        }
        elmText.value = text;
        elmText.className = (!Tigerian.Class.isInstance(theme, "string") || (theme === "")) ? "" : theme + "_textbox";


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


        //NOTE Private Functions
        function onClick(e) {
            elmText.focus();
        }


        //NOTE Public Functions
        this.select = function () {
            elmText.select();
        };


        //NOTE Default Event
        this.addEvent("click", onClick);
    }
});
