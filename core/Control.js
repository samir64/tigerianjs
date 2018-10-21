/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */


'use strict';

/**
 * @param {string} [style = ""]
 * @param {Tigerian.Application|Tigerian.Control} [parent = undefined]
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
        this.setAttribute("element-situation", "");
        this.setAttribute("element-hoverable", "false");

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
        this.setAttribute("align", "");
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
                var v = this.getAttribute("small-column");
                switch (v) {
                    case "":
                        return Tigerian.BWindow.ENone;
                        break;

                    case "medium":
                        return Tigerian.BWindow.EMedium;
                        break;

                    case "normal":
                        return Tigerian.BWindow.ENormal;
                        break;

                    case "large":
                        return Tigerian.BWindow.ELarge;
                        break;

                    case "xlarge":
                        return Tigerian.BWindow.EXLarge;
                        break;

                    default:
                        v = parseInt(v, 12);
                        return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
                }
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                switch (v) {
                    case Tigerian.BWindow.ENone:
                        this.setAttribute("small-column", "");
                        break;

                    case Tigerian.BWindow.EMedium:
                        this.setAttribute("small-column", "medium");
                        break;

                    case Tigerian.BWindow.ENormal:
                        this.setAttribute("small-column", "normal");
                        break;

                    case Tigerian.BWindow.ELarge:
                        this.setAttribute("small-column", "large");
                        break;

                    case Tigerian.BWindow.EXLarge:
                        this.setAttribute("small-column", "xlarge");
                        break;

                    default:
                        if (Tigerian.Class.isInstance(v, "number")) {
                            this.setAttribute("small-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
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
                var v = this.getAttribute("medium-column");
                switch (v) {
                    case "":
                        return Tigerian.BWindow.ENone;
                        break;

                    case "small":
                        return Tigerian.BWindow.ESmall;
                        break;

                    case "normal":
                        return Tigerian.BWindow.ENormal;
                        break;

                    case "large":
                        return Tigerian.BWindow.ELarge;
                        break;

                    case "xlarge":
                        return Tigerian.BWindow.EXLarge;
                        break;

                    default:
                        v = parseInt(v, 12);
                        return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
                }
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                switch (v) {
                    case Tigerian.BWindow.ENone:
                        this.setAttribute("medium-column", "");
                        break;

                    case Tigerian.BWindow.ESmall:
                        this.setAttribute("medium-column", "small");
                        break;

                    case Tigerian.BWindow.ENormal:
                        this.setAttribute("medium-column", "normal");
                        break;

                    case Tigerian.BWindow.ELarge:
                        this.setAttribute("medium-column", "large");
                        break;

                    case Tigerian.BWindow.EXLarge:
                        this.setAttribute("medium-column", "xlarge");
                        break;

                    default:
                        if (Tigerian.Class.isInstance(v, "number")) {
                            this.setAttribute("medium-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
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
                var v = this.getAttribute("normal-column");
                switch (v) {
                    case "":
                        return Tigerian.BWindow.ENone;
                        break;

                    case "small":
                        return Tigerian.BWindow.ESmall;
                        break;

                    case "medium":
                        return Tigerian.BWindow.EMedium;
                        break;

                    case "large":
                        return Tigerian.BWindow.ELarge;
                        break;

                    case "xlarge":
                        return Tigerian.BWindow.EXLarge;
                        break;

                    default:
                        v = parseInt(v, 12);
                        return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
                }
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                switch (v) {
                    case Tigerian.BWindow.ENone:
                        this.setAttribute("normal-column", "");
                        break;

                    case Tigerian.BWindow.ESmall:
                        this.setAttribute("normal-column", "small");
                        break;

                    case Tigerian.BWindow.EMedium:
                        this.setAttribute("normal-column", "medium");
                        break;

                    case Tigerian.BWindow.ELarge:
                        this.setAttribute("normal-column", "large");
                        break;

                    case Tigerian.BWindow.EXLarge:
                        this.setAttribute("normal-column", "xlarge");
                        break;

                    default:
                        if (Tigerian.Class.isInstance(v, "number")) {
                            this.setAttribute("normal-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
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
                var v = this.getAttribute("large-column");
                switch (v) {
                    case "":
                        return Tigerian.BWindow.ENone;
                        break;

                    case "small":
                        return Tigerian.BWindow.ESmall;
                        break;

                    case "medium":
                        return Tigerian.BWindow.EMedium;
                        break;

                    case "normal":
                        return Tigerian.BWindow.ENormal;
                        break;

                    case "xlarge":
                        return Tigerian.BWindow.EXLarge;
                        break;

                    default:
                        v = parseInt(v, 12);
                        return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
                }
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                switch (v) {
                    case Tigerian.BWindow.ENone:
                        this.setAttribute("large-column", "");
                        break;

                    case Tigerian.BWindow.ESmall:
                        this.setAttribute("large-column", "small");
                        break;

                    case Tigerian.BWindow.EMedium:
                        this.setAttribute("large-column", "medium");
                        break;

                    case Tigerian.BWindow.ENormal:
                        this.setAttribute("large-column", "normal");
                        break;

                    case Tigerian.BWindow.EXLarge:
                        this.setAttribute("large-column", "xlarge");
                        break;

                    default:
                        if (Tigerian.Class.isInstance(v, "number")) {
                            this.setAttribute("large-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
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
                var v = this.getAttribute("xlarge-column");
                switch (v) {
                    case "":
                        return Tigerian.BWindow.ENone;
                        break;

                    case "small":
                        return Tigerian.BWindow.ESmall;
                        break;

                    case "medium":
                        return Tigerian.BWindow.EMedium;
                        break;

                    case "normal":
                        return Tigerian.BWindow.ENormal;
                        break;

                    case "large":
                        return Tigerian.BWindow.ELarge;
                        break;

                    default:
                        v = parseInt(v, 12);
                        return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
                }
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                switch (v) {
                    case Tigerian.BWindow.ENone:
                        this.setAttribute("xlarge-column", "");
                        break;

                    case Tigerian.BWindow.ESmall:
                        this.setAttribute("xlarge-column", "small");
                        break;

                    case Tigerian.BWindow.EMedium:
                        this.setAttribute("xlarge-column", "medium");
                        break;

                    case Tigerian.BWindow.ENormal:
                        this.setAttribute("xlarge-column", "normal");
                        break;

                    case Tigerian.BWindow.ELarge:
                        this.setAttribute("xlarge-column", "large");
                        break;

                    default:
                        if (Tigerian.Class.isInstance(v, "number")) {
                            this.setAttribute("xlarge-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
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
                        return Tigerian.Control.ERight;
                        break;
                    case "center":
                        return Tigerian.Control.ECenter;
                        break;
                    case "justify":
                        return Tigerian.Control.EJustify;
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
                    case Tigerian.Control.ERight:
                        this.setAttribute("align", "right");
                        break;
                    case Tigerian.Control.ECenter:
                        this.setAttribute("align", "center");
                        break;
                    case Tigerian.Control.EJustify:
                        this.setAttribute("align", "justify");
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

        Object.defineProperty(this, "hoverable", {
            enumerable: true,
            configurable: true,
            get: function () {
                return (this.getAttribute("element-hoverable") === "true");
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    this.setAttribute("element-hoverable", v ? "true" : "false");
                }
            },
        });

        Object.defineProperty(this, "situation", {
            enumerable: true,
            configurable: true,
            get: function () {
                var v = this.getAttribute("element-situation");

                switch (v) {
                    case "title":
                        return Tigerian.Control.ETitle;

                    case "default":
                        return Tigerian.Control.EDefault;

                    case "transparent":
                        return Tigerian.Control.ETransparent;

                    case "opposite":
                        return Tigerian.Control.EOpposite;

                    case "warning":
                        return Tigerian.Control.EWarning;

                    case "danger":
                        return Tigerian.Control.EDanger;

                    case "disable":
                        return Tigerian.Control.EDisable;

                    case "ok":
                        return Tigerian.Control.EOk;

                    default:
                        return Tigerian.Control.ENone;
                }
            },
            set: function (v) {
                switch (v) {
                    case Tigerian.Control.ETitle:
                        this.setAttribute("element-situation", "title");
                        break;

                    case Tigerian.Control.EDefault:
                        this.setAttribute("element-situation", "default");
                        break;

                    case Tigerian.Control.ETransparent:
                        this.setAttribute("element-situation", "transparent");
                        break;

                    case Tigerian.Control.EOpposite:
                        this.setAttribute("element-situation", "opposite");
                        break;

                    case Tigerian.Control.EWarning:
                        this.setAttribute("element-situation", "warning");
                        break;

                    case Tigerian.Control.EDanger:
                        this.setAttribute("element-situation", "danger");
                        break;

                    case Tigerian.Control.EDisable:
                        this.setAttribute("element-situation", "disable");
                        break;

                    case Tigerian.Control.EOk:
                        this.setAttribute("element-situation", "ok");
                        break;

                    case Tigerian.Control.ENone:
                    default:
                        this.setAttribute("element-situation", "");
                        break;
                }
            },
        });

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
    enums: ["left", "right", "center", "justify", "none", "default", "title", "transparent", "opposite", "warning", "danger", "disable", "ok"],
});