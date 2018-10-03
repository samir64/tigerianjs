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
 * @extends {Tigerian}
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
        var superAddControl = this.addControl;


        //NOTE Append Elements
        elmDivContainer.appendChild(elmTxtHead);
        elmDivContainer.appendChild(elmTxtFoot);


        //NOTE Attributes
        this.setAttribute("element-type", "Control");
        this.setAttribute("element-name", "container");

        this.setAttribute("small-column", "normal");
        this.setAttribute("medium-column", "normal");
        this.setAttribute("normal-column", "12");
        this.setAttribute("large-column", "normal");
        this.setAttribute("xlarge-column", "normal");
        this.setAttribute("hide-on-small", "false");
        this.setAttribute("hide-on-medium", "false");
        this.setAttribute("hide-on-normal", "false");
        this.setAttribute("hide-on-large", "false");
        this.setAttribute("hide-on-xlarge", "false");
        this.setAttribute("float", "");
        this.setAttribute("template-name", "");
        this.setAttribute("template-item", "");

        //NOTE Properties
        /**
         * @member {string}
         */
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

        /**
         * @member {string}
         */
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

        /**
         * @member {number}
         */
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

        /**
         * @member {number|string}
         */
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
                    this.setAttribute("small-column", ((value < 1) ? "1" : ((value > 12) ? "12" : value)));
                } else if (Tigerian.Class.isInstance(value, "string")) {
                    switch (value) {
                        // case "small":
                        case "medium":
                        case "normal":
                        case "large":
                        case "xlarge":
                            this.setAttribute("small-column", value);
                            break;

                        default:
                    }
                }
            }
        });

        /**
         * @member {number|string}
         */
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
                } else if (Tigerian.Class.isInstance(value, "string")) {
                    switch (value) {
                        case "small":
                            // case "medium":
                        case "normal":
                        case "large":
                        case "xlarge":
                            this.setAttribute("medium-column", value);
                            break;

                        default:
                    }
                }
            }
        });

        /**
         * @member {number|string}
         */
        Object.defineProperty(this, "normalColumn", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("normal-column");
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "number")) {
                    this.setAttribute("normal-column", ((value < 1) ? "1" : ((value > 12) ? "12" : value)));
                } else if (Tigerian.Class.isInstance(value, "string")) {
                    switch (value) {
                        case "small":
                        case "medium":
                            // case "normal":
                        case "large":
                        case "xlarge":
                            this.setAttribute("normal-column", value);
                            break;

                        default:
                    }
                }
            }
        });

        /**
         * @member {number|string}
         */
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
                } else if (Tigerian.Class.isInstance(value, "string")) {
                    switch (value) {
                        case "small":
                        case "medium":
                        case "normal":
                            // case "large":
                        case "xlarge":
                            this.setAttribute("large-column", value);
                            break;

                        default:
                    }
                }
            }
        });

        /**
         * @member {number|string}
         */
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
                } else if (Tigerian.Class.isInstance(value, "string")) {
                    switch (value) {
                        case "small":
                        case "medium":
                        case "normal":
                        case "large":
                            // case "xlarge":
                            this.setAttribute("xlarge-column", value);
                            break;

                        default:
                    }
                }
            }
        });

        /**
         * @member {boolean}
         */
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

        /**
         * @member {boolean}
         */
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

        /**
         * @member {boolean}
         */
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

        /**
         * @member {boolean}
         */
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

        /**
         * @member {boolean}
         */
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

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "float", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                switch (this.getAttribute("float")) {
                    case "left":
                        return Tigerian.Control.ELeft;
                        break;
                    case "right":
                        return Tigerian.Control.ERight;
                        break;
                    case "center":
                        return Tigerian.Control.ECenter;
                        break;
                    default:
                        return Tigerian.Control.ENone;
                        break;
                }
            },
            /**
             * @param {string} value
             */
            set: function (v) {
                switch (v) {
                    case Tigerian.Control.ELeft:
                        this.setAttribute("float", "left");
                        break;
                    case Tigerian.Control.ERight:
                        this.setAttribute("float", "right");
                        break;
                    case Tigerian.Control.ECenter:
                        this.setAttribute("float", "center");
                        break;
                    default:
                        this.setAttribute("float", "");
                        break;
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "align", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                switch (this.getAttribute("align")) {
                    case "left":
                        return Tigerian.Control.ELeft;
                        break;
                    case "right":
                        return Tigerian.Control.ERigth;
                        break;
                    case "center":
                        return Tigerian.Control.ECenter;
                        break;
                    default:
                        return Tigerian.Control.ENone;
                        break;
                }
            },
            /**
             * @param {string} value
             */
            set: function (v) {
                switch (v) {
                    case Tigerian.Control.ELeft:
                        this.setAttribute("align", "left");
                        break;
                    case Tigerian.Control.ERigth:
                        this.setAttribute("align", "right");
                        break;
                    case Tigerian.Control.ECenter:
                        this.setAttribute("align", "center");
                        break;
                    default:
                        this.setAttribute("align", "");
                        break;
                }
            }
        });

        // /**
        //  * @member {boolean}
        //  */
        // Object.defineProperty(this, "floatLeft", {
        //     enumerable: true,
        //     configurable: true,
        //     /**
        //      * @returns {string}
        //      */
        //     get: function () {
        //         return (this.getAttribute("float") === "left");
        //     },
        //     /**
        //      * @param {string} value
        //      */
        //     set: function (value) {
        //         if (Tigerian.Class.isInstance(value, "boolean")) {
        //             this.setAttribute("float", (value ? "left" : "false"));
        //         }
        //     }
        // });

        // /**
        //  * @member {boolean}
        //  */
        // Object.defineProperty(this, "floatRight", {
        //     enumerable: true,
        //     configurable: true,
        //     /**
        //      * @returns {string}
        //      */
        //     get: function () {
        //         return (this.getAttribute("float") === "right");
        //     },
        //     /**
        //      * @param {string} value
        //      */
        //     set: function (value) {
        //         if (Tigerian.Class.isInstance(value, "boolean")) {
        //             this.setAttribute("float", (value ? "right" : "false"));
        //         }
        //     }
        // });

        // /**
        //  * @member {boolean}
        //  */
        // Object.defineProperty(this, "floatCenter", {
        //     enumerable: true,
        //     configurable: true,
        //     /**
        //      * @returns {string}
        //      */
        //     get: function () {
        //         return (this.getAttribute("float") === "center");
        //     },
        //     /**
        //      * @param {string} value
        //      */
        //     set: function (value) {
        //         if (Tigerian.Class.isInstance(value, "boolean")) {
        //             this.setAttribute("float", (value ? "center" : "false"));
        //         }
        //     }
        // });

        /**
         * @member {string}
         */
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

        /**
         * @member {string}
         */
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
            superAddControl(control);
            elmDivContainer.appendChild(elmTxtFoot);
        };

        this.click = function () {
            elmDivContainer.click();
        };

        // this.focus = function () {
        //     elmDivContainer.focus();
        // };

        this.toString = function () {
            return "[Tigerian.Control (Or one of its sub classes) Instance]";
        };
    },
    enums: ["left", "right", "center", "none"],
});