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
 * @property {Tigerian.Application|Tigerian.Control} parent
 * @property {string} style
 *
 * @property {string} headText
 * @property {string} footText
 *
 * @property {number} tabIndex
 *
 * @property {number} smallColumn
 * @property {number} mediumColumn
 * @property {number} column
 * @property {number} largeColumn
 * @property {number} xlargeColumn
 *
 * @property {boolean} hideOnSmall
 * @property {boolean} hideOnMedium
 * @property {boolean} hideOnNormal
 * @property {boolean} hideOnLarge
 * @property {boolean} hideOnXlarge
 *
 * @property {boolean} floatLeft
 * @property {boolean} floatRight
 * @property {boolean} floatCenter
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
                return instance.hasAttribute("tabindex") ? instance.getAttribute("tabindex") : 0;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number")) {
                    if (v > 0) {
                        instance.setAttribute("tabindex", v);
                    } else {
                        instance.removeAttribute("tabindex");
                    }
                }
            }
        });

        Object.defineProperty(this, "smallColumn", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("small-column");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "number")) {
                    this.setAttribute("medium-column", ((value < 1) ? "1" : ((value > 12) ? "12" : value)));
                }
            }
        });

        Object.defineProperty(this, "mediumColumn", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("medium-column");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "number")) {
                    this.setAttribute("medium-column", ((value < 1) ? "1" : ((value > 12) ? "12" : value)));
                }
            }
        });

        Object.defineProperty(this, "column", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("column");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "number")) {
                    this.setAttribute("column", ((value < 1) ? "1" : ((value > 12) ? "12" : value)));
                }
            }
        });

        Object.defineProperty(this, "largeColumn", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("large-column");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "number")) {
                    this.setAttribute("large-column", ((value < 1) ? "1" : ((value > 12) ? "12" : value)));
                }
            }
        });

        Object.defineProperty(this, "xlargeColumn", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("xlarge-column");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "number")) {
                    this.setAttribute("xlarge-column", ((value < 1) ? "1" : ((value > 12) ? "12" : value)));
                }
            }
        });

        Object.defineProperty(this, "hideOnSmall", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.getAttribute("hide-on-small");
            },
            /**
             * @param {boolean} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("hide-on-small", value);
                }
            }
        });

        Object.defineProperty(this, "hideOnMedium", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.getAttribute("hide-on-medium");
            },
            /**
             * @param {boolean} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("hide-on-medium", value);
                }
            }
        });

        Object.defineProperty(this, "hideOnNormal", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.getAttribute("hide-on-normal");
            },
            /**
             * @param {boolean} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("hide-on-normal", value);
                }
            }
        });

        Object.defineProperty(this, "hideOnLarge", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.getAttribute("hide-on-large");
            },
            /**
             * @param {boolean} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("hide-on-large", value);
                }
            }
        });

        Object.defineProperty(this, "hideOnXlarge", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.getAttribute("hide-on-xlarge");
            },
            /**
             * @param {boolean} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("hide-on-xlarge", value);
                }
            }
        });

        Object.defineProperty(this, "floatLeft", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return (this.getAttribute("float") === "left");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("float", (value ? "left" : "false"));
                }
            }
        });

        Object.defineProperty(this, "floatRight", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return (this.getAttribute("float") === "right");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("float", (value ? "right" : "false"));
                }
            }
        });

        Object.defineProperty(this, "floatCenter", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return (this.getAttribute("float") === "center");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    this.setAttribute("float", (value ? "center" : "false"));
                }
            }
        });

        Object.defineProperty(this, "templateName", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("template-name");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    this.setAttribute("template-name", value);
                }
            }
        });

        Object.defineProperty(this, "templateItem", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("template-item");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    this.setAttribute("template-item", value);
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

        this.setAttribute("small-column", "12");
        this.setAttribute("medium-column", "12");
        this.setAttribute("column", "12");
        this.setAttribute("large-column", "12");
        this.setAttribute("xlarge-column", "12");
        this.setAttribute("hide-on-small", "false");
        this.setAttribute("hide-on-medium", "false");
        this.setAttribute("hide-on-normal", "false");
        this.setAttribute("hide-on-large", "false");
        this.setAttribute("hide-on-xlarge", "false");
        this.setAttribute("float", "");
        this.setAttribute("template-name", "");
        this.setAttribute("template-item", "");
    },
});
