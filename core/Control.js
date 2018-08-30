/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */


'use strict';

/**
 * @param {string} [style = ""]
 * @param {Tigerian.Application|Tigerian.Control} [parent = undefined]
 *
 * @property {boolean} enabled
 * @property {boolean} visible
 * @property {boolean} autoVisible
 * @property {Tigerian.Application|Tigerian.Control} parent
 * @property {string} style
 * @property {string} headText
 * @property {string} footText
 * @property {number} tabIndex
 *
 * @extends Tigerian
 * @constructor
 */
Tigerian.Control = Tigerian.UI.extend({
    /**
     * @param {Function} superClass
     * @param {Tigerian.UI} parent
     * @param {string} theme
     */
    init: function (parent, theme) {
        var elmDivContainer = document.createElement("div");

        this.super(elmDivContainer, parent, theme);

        //NOTE Private Variables
        var instance = this;
        var elmTxtHead = document.createTextNode("");
        var elmTxtFoot = document.createTextNode("");


        //NOTE Alias Super Members
        var addControl = this.addControl;


        //NOTE Append Elements
        elmDivContainer.appendChild(elmTxtHead);
        elmDivContainer.appendChild(elmTxtFoot);


        //NOTE Attributes
        this.setAttribute("element-name", "container");
        this.setAttribute("element-type", "Control");
        this.setAttribute("tabindex", -1);


        //NOTE Properties
        Object.defineProperty(this, "headText", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return elmTxtHead.data;
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmTxtHead.data = value;
                }
            }
        });

        Object.defineProperty(this, "footText", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return elmTxtFoot.data;
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmTxtFoot.data = value;
                }
            }
        });

        Object.defineProperty(this, "tabIndex", {
            enumerable: true,
            configurable: true,
            get: function () {
                return instance.getAttribute("tabindex");
            },
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "number")) {
                    instance.setAttribute("tabindex", value);
                }
            }
        });


        //NOTE Public Functions
        /*
         /!**
         * @param {Tigerian.Label} label
         *!/
         this.addLabel = function (label) {
         if (Tigerian.Class.isInstance(label, Tigerian.Label)) {
         label.for(elmDivContainer);
         }
         }
         */

        /**
         * @param {Element|Tigerian.Control} control
         */
        this.addControl = function (control) {
            addControl(control);
            elmDivContainer.appendChild(elmTxtFoot);
        };

        this.click = function () {
            elmDivContainer.click();
        };

        this.focus = function () {
            elmDivContainer.focus();
        };

        this.toString = function () {
            return "[Tigerian.Control (Or one of its sub classes) Instance]";
        };
    },
});
