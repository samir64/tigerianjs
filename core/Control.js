/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */


("use strict");

/**
 * @param {string} [style = ""]
 * @param {Application|Control} [parent = undefined]
 *
 * @extends {Tigerian}
 * @constructor
 */
Control = UI.extend({
    /**
     * @param {UI} parent
     * @param {string} theme
     */
    init: function (parent, theme) {
        var elmDivContainer = document.createElement("div");

        this.super(elmDivContainer, parent, theme);

        //NOTE Private Variables
        var instance = this;
        var vSuper = this.super;
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
        this.setAttribute("title", "");
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
             * @param {string} v
             */
            set: function (v) {
                if (Class.isInstance(v, "string")) {
                    elmTxtHead.data = v;
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
             * @param {string} v
             */
            set: function (v) {
                if (Class.isInstance(v, "string")) {
                    elmTxtFoot.data = v;
                }
            }
        });
        /**
         * @member {string}
         */
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return this.getAttribute("title");
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                if (Class.isInstance(v, "string")) {
                    this.setAttribute("title", v);
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
                if (Class.isInstance(v, "number")) {
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
                        return BWindow.ENone;
                        break;

                    case "medium":
                        return BWindow.EMedium;
                        break;

                    case "normal":
                        return BWindow.ENormal;
                        break;

                    case "large":
                        return BWindow.ELarge;
                        break;

                    case "xlarge":
                        return BWindow.EXLarge;
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
                    case BWindow.ENone:
                        this.setAttribute("small-column", "");
                        break;

                    case BWindow.EMedium:
                        this.setAttribute("small-column", "medium");
                        break;

                    case BWindow.ENormal:
                        this.setAttribute("small-column", "normal");
                        break;

                    case BWindow.ELarge:
                        this.setAttribute("small-column", "large");
                        break;

                    case BWindow.EXLarge:
                        this.setAttribute("small-column", "xlarge");
                        break;

                    default:
                        if (Class.isInstance(v, "number")) {
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
                        return BWindow.ENone;
                        break;

                    case "small":
                        return BWindow.ESmall;
                        break;

                    case "normal":
                        return BWindow.ENormal;
                        break;

                    case "large":
                        return BWindow.ELarge;
                        break;

                    case "xlarge":
                        return BWindow.EXLarge;
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
                    case BWindow.ENone:
                        this.setAttribute("medium-column", "");
                        break;

                    case BWindow.ESmall:
                        this.setAttribute("medium-column", "small");
                        break;

                    case BWindow.ENormal:
                        this.setAttribute("medium-column", "normal");
                        break;

                    case BWindow.ELarge:
                        this.setAttribute("medium-column", "large");
                        break;

                    case BWindow.EXLarge:
                        this.setAttribute("medium-column", "xlarge");
                        break;

                    default:
                        if (Class.isInstance(v, "number")) {
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
                        return BWindow.ENone;
                        break;

                    case "small":
                        return BWindow.ESmall;
                        break;

                    case "medium":
                        return BWindow.EMedium;
                        break;

                    case "large":
                        return BWindow.ELarge;
                        break;

                    case "xlarge":
                        return BWindow.EXLarge;
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
                    case BWindow.ENone:
                        this.setAttribute("normal-column", "");
                        break;

                    case BWindow.ESmall:
                        this.setAttribute("normal-column", "small");
                        break;

                    case BWindow.EMedium:
                        this.setAttribute("normal-column", "medium");
                        break;

                    case BWindow.ELarge:
                        this.setAttribute("normal-column", "large");
                        break;

                    case BWindow.EXLarge:
                        this.setAttribute("normal-column", "xlarge");
                        break;

                    default:
                        if (Class.isInstance(v, "number")) {
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
                        return BWindow.ENone;
                        break;

                    case "small":
                        return BWindow.ESmall;
                        break;

                    case "medium":
                        return BWindow.EMedium;
                        break;

                    case "normal":
                        return BWindow.ENormal;
                        break;

                    case "xlarge":
                        return BWindow.EXLarge;
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
                    case BWindow.ENone:
                        this.setAttribute("large-column", "");
                        break;

                    case BWindow.ESmall:
                        this.setAttribute("large-column", "small");
                        break;

                    case BWindow.EMedium:
                        this.setAttribute("large-column", "medium");
                        break;

                    case BWindow.ENormal:
                        this.setAttribute("large-column", "normal");
                        break;

                    case BWindow.EXLarge:
                        this.setAttribute("large-column", "xlarge");
                        break;

                    default:
                        if (Class.isInstance(v, "number")) {
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
                        return BWindow.ENone;
                        break;

                    case "small":
                        return BWindow.ESmall;
                        break;

                    case "medium":
                        return BWindow.EMedium;
                        break;

                    case "normal":
                        return BWindow.ENormal;
                        break;

                    case "large":
                        return BWindow.ELarge;
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
                    case BWindow.ENone:
                        this.setAttribute("xlarge-column", "");
                        break;

                    case BWindow.ESmall:
                        this.setAttribute("xlarge-column", "small");
                        break;

                    case BWindow.EMedium:
                        this.setAttribute("xlarge-column", "medium");
                        break;

                    case BWindow.ENormal:
                        this.setAttribute("xlarge-column", "normal");
                        break;

                    case BWindow.ELarge:
                        this.setAttribute("xlarge-column", "large");
                        break;

                    default:
                        if (Class.isInstance(v, "number")) {
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
             * @param {boolean} v
             */
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    this.setAttribute("hide-on-small", v);
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
             * @param {boolean} v
             */
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    this.setAttribute("hide-on-medium", v);
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
             * @param {boolean} v
             */
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    this.setAttribute("hide-on-normal", v);
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
             * @param {boolean} v
             */
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    this.setAttribute("hide-on-large", v);
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
             * @param {boolean} v
             */
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    this.setAttribute("hide-on-xlarge", v);
                }
            }
        });

        /**
         * @member {Symbol}
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
                        return Control.ELeft;
                        break;
                    case "right":
                        return Control.ERight;
                        break;
                    case "center":
                        return Control.ECenter;
                        break;
                    default:
                        return Control.ENone;
                        break;
                }
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                switch (v) {
                    case Control.ELeft:
                        this.setAttribute("float", "left");
                        break;
                    case Control.ERight:
                        this.setAttribute("float", "right");
                        break;
                    case Control.ECenter:
                        this.setAttribute("float", "center");
                        break;
                    default:
                        this.setAttribute("float", "");
                        break;
                }
            }
        });

        /**
         * @member {Symbol}
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
                        return Control.ELeft;
                        break;
                    case "right":
                        return Control.ERight;
                        break;
                    case "center":
                        return Control.ECenter;
                        break;
                    case "justify":
                        return Control.EJustify;
                        break;
                    default:
                        return Control.ENone;
                        break;
                }
            },
            /**
             * @param {string} v
             */
            set: function (v) {
                switch (v) {
                    case Control.ELeft:
                        this.setAttribute("align", "left");
                        break;
                    case Control.ERight:
                        this.setAttribute("align", "right");
                        break;
                    case Control.ECenter:
                        this.setAttribute("align", "center");
                        break;
                    case Control.EJustify:
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
        //      * @param {string} v
        //      */
        //     set: function (v) {
        //         if (Class.isInstance(v, "boolean")) {
        //             this.setAttribute("float", (v ? "left" : "false"));
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
        //      * @param {string} v
        //      */
        //     set: function (v) {
        //         if (Class.isInstance(v, "boolean")) {
        //             this.setAttribute("float", (v ? "right" : "false"));
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
        //      * @param {string} v
        //      */
        //     set: function (v) {
        //         if (Class.isInstance(v, "boolean")) {
        //             this.setAttribute("float", (v ? "center" : "false"));
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
             * @param {string} v
             */
            set: function (v) {
                if (Class.isInstance(v, "string")) {
                    this.setAttribute("template-name", v);
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
             * @param {string} v
             */
            set: function (v) {
                if (Class.isInstance(v, "string")) {
                    this.setAttribute("template-item", v);
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
                if (Class.isInstance(v, "boolean")) {
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
                        return Control.ETitle;

                    case "default":
                        return Control.EDefault;

                    case "transparent":
                        return Control.ETransparent;

                    case "opposite":
                        return Control.EOpposite;

                    case "warning":
                        return Control.EWarning;

                    case "danger":
                        return Control.EDanger;

                    case "disable":
                        return Control.EDisable;

                    case "ok":
                        return Control.EOk;

                    default:
                        return Control.ENone;
                }
            },
            set: function (v) {
                switch (v) {
                    case Control.ETitle:
                        this.setAttribute("element-situation", "title");
                        break;

                    case Control.EDefault:
                        this.setAttribute("element-situation", "default");
                        break;

                    case Control.ETransparent:
                        this.setAttribute("element-situation", "transparent");
                        break;

                    case Control.EOpposite:
                        this.setAttribute("element-situation", "opposite");
                        break;

                    case Control.EWarning:
                        this.setAttribute("element-situation", "warning");
                        break;

                    case Control.EDanger:
                        this.setAttribute("element-situation", "danger");
                        break;

                    case Control.EDisable:
                        this.setAttribute("element-situation", "disable");
                        break;

                    case Control.EOk:
                        this.setAttribute("element-situation", "ok");
                        break;

                    case Control.ENone:
                    default:
                        this.setAttribute("element-situation", "");
                        break;
                }
            },
        });

        /**
         * @param {Element|Control} control
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
            return "[Control (Or one of its sub classes) Instance]";
        };
    },
    enums: ["left", "right", "center", "justify", "none", "default", "title", "transparent", "opposite", "warning", "danger", "disable", "ok"],
});