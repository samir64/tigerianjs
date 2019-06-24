/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */


("use strict");


/**
 * @implements {BBind}
 * @extends {Class}
 *
 * @constructor
 * @abstract
 */
UI = Class.extend({
    /**
     * @param {Element} [mainElement = document.body]
     * @param {UI} [parent = undefined]
     * @param {string} [theme]
     */
    init: function (mainElement, parent, theme) {
        this.super();

        if (!Class.isInstance(mainElement, Element)) {
            mainElement = document.body;
        }

        if (!Class.isInstance(parent, UI)) {
            parent = undefined;
        }

        for (var i = 0; i < mainElement.children.length; i++) {
            mainElement.removeChild(mainElement.children[i]);
        }

        this.config("bind");
        this.config("style", mainElement);
        this.config("event", mainElement);

        //NOTE Private Constants
        /**
         * @type {string[]}
         */
        var attributesSetProtected = [];
        /**
         * @type {string[]}
         */
        var attributesRemoveProtected = attributesSetProtected.concat(["visible", "element-name", "element-type"]);


        //NOTE Private Variables
        var instance = this;
        /**
         * @type {{}}
         */
        var events = {};


        //NOTE Properties
        /**
         * @member {Tigerin.UI|Element}
         */
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {Application}
             */
            get: function () {
                return parent;
            },
            /**
             * @param {UI} value
             */
            set: function (v) {
                if (v === undefined) {
                    parent = undefined;
                    if (mainElement.parentNode) {
                        mainElement.parentNode.removeChild(mainElement);
                    }
                } else if (Class.isInstance(v, UI)) {
                    parent = v;
                    v.addControl(this);
                } else if (Class.isInstance(v, Element)) {
                    v.appendChild(mainElement);
                    parent = v;
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return !this.hasAttribute("disabled");
            },
            /**
             * @param {boolean} value
             */
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    if (v === false) {
                        this.setAttribute("disabled", "true");
                    } else {
                        this.removeAttribute("disabled");
                    }
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "focused", {
            enumerable: true,
            configurable: true,
            get: function () {
                var result = document.activeElement === mainElement;

                for (var i = 0; !result && (i < mainElement.children.length); i++) {
                    result = (document.activeElement === mainElement.children[i]);
                }

                return result;
            },
            set: function (v) {
                if (Class.isInstance(v, "boolean")) {
                    this.setAttribute("focused", v);
                    if (v === true) {
                        this.focus();
                    } else if (this.focused) {
                        document.activeElement = undefined;
                    }
                }
            }
        });

        /**
         * @member {Symbol}
         */
        Object.defineProperty(this, "direction", {
            enumerable: true,
            configurable: true,
            get: function () {
                if (this.hasAttribute("dir")) {
                    var dir = this.getAttribute("dir");
                    switch (dir) {
                        case "ltr":
                            return UI.ELeftToRight;
                            break;
                        case "rtl":
                            return UI.ERightToLeft;
                            break;
                        default:
                            return "";
                    }
                }
            },
            set: function (v) {
                switch (v) {
                    case UI.ELeftToRight:
                        this.setAttribute("dir", "ltr");
                        break;
                    case UI.ERightToLeft:
                        this.setAttribute("dir", "rtl");
                        break;
                    default:
                        this.removeAttribute("dir");
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "visible", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return (this.getAttribute("visible") === "true");
            },
            /**
             * @param {boolean} v
             */
            set: function (v) {
                setVisible(v);
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "theme", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return mainElement.className;
            },
        });


        //NOTE Private Functions
        /**
         * @param {boolean} v
         */
        function setVisible(v) {
            if (Class.isInstance(v, "boolean")) {
                var lastVisible = (instance.getAttribute("visible") === "true");
                instance.setAttribute("visible", (v ? "true" : "false"));

                if (lastVisible !== v) {
                    instance.dispatchEvent(Events.onVisibleChange);
                }
            }
        }

        /**
         * @param {Elemenet} element
         * @param {string} themeName
         */
        function addThemeToChildren(element, themeName) {
            var elm = new Iterator(Array.from(element.children));
            elm.yield = function () {
                return this.list[this.index];
            };

            while (!elm.done) {
                if (elm.value.hasAttribute("element-name") && (elm.value.getAttribute("element-name") === "container")) {
                    elm.value.classList.add(themeName);
                }
                addThemeToChildren(elm.value, themeName);

                elm.next();
            }
        }

        /**
         * @param {Elemenet} element
         * @param {string} themeName
         */
        function removeThemeFromChildren(element, themeName) {
            var elm = new Iterator(Array.from(element.children));
            elm.yield = function () {
                return this.list[this.index];
            };

            while (!elm.done) {
                if (elm.value.hasAttribute("element-name") && (elm.value.getAttribute("element-name") === "container")) {
                    elm.value.classList.remove(themeName);
                }
                removeThemeFromChildren(elm.value, themeName);

                elm.next();
            }
        }

        /**
         * @param {Elemenet} element
         */
        function removeAllThemesFromChildren(element) {
            var elm = new Iterator(Array.from(element.children));
            elm.yield = function () {
                return this.list[this.index];
            };

            while (!elm.done) {
                if (elm.value.hasAttribute("element-name") && (elm.value.getAttribute("element-name") === "container")) {
                    elm.value.className = "";
                }
                removeAllThemesFromChildren(elm.value);

                elm.next();
            }
        }


        //NOTE Public Functions
        this.remove = function () {
            this.parent = undefined;
        };

        /**
         * @param {Control} control
         */
        this.addControl = function (control) {
            // console.warn(Class.isInstance(control, Control));
            if (Class.isInstance(control, Element) || Class.isInstance(control, Text)) {
                mainElement.appendChild(control);
            } else if (Class.isInstance(control, Control)) {
                control.appendTo(this, mainElement);
            }
        }.bind(this);

        /**
         * @param {string} attrName
         * @param {string} attrValue
         */
        this.setAttribute = function (attrName, attrValue) {
            if (Class.isInstance(mainElement, Element) && Class.isInstance(attrName, "string") && (attributesSetProtected.indexOf(attrName) === -1)) {
                mainElement.setAttribute(attrName, attrValue.toString());
            }
        };

        /**
         * @param {string} attrName
         * @returns {string}
         */
        this.getAttribute = function (attrName) {
            if (Class.isInstance(mainElement, Element) && Class.isInstance(attrName, "string")) {
                return mainElement.getAttribute(attrName);
            }
        };

        /**
         * @param {string} attrName
         * @returns {boolean}
         */
        this.hasAttribute = function (attrName) {
            if (Class.isInstance(mainElement, Element) && Class.isInstance(attrName, "string")) {
                return mainElement.hasAttribute(attrName);
            }
        };

        /**
         * @param {string} attrName
         */
        this.removeAttribute = function (attrName) {
            if (Class.isInstance(mainElement, Element) && Class.isInstance(attrName, "string") && (attributesRemoveProtected.indexOf(attrName) === -1)) {
                mainElement.removeAttribute(attrName);
            }
        };

        /**
         * @param {Element} elmContainer
         * @returns {boolean}
         */
        this.matchContainer = function (elmContainer) {
            return elmContainer === mainElement;
        };

        /**
         * @param {UI} parentControl
         * @param {Element} elmParentContainer
         */
        this.appendTo = function (parentControl, elmParentContainer) {
            if (Class.isInstance(parentControl, UI) && parentControl.matchContainer(elmParentContainer)) {
                parent = parentControl;
                elmParentContainer.appendChild(mainElement);
            }
        };

        /**
         * @param {string} themeName
         * @param {boolean} affectChildren = true
         */
        this.addTheme = function (themeName, affectChildren) {
            if (Class.isInstance(themeName, "string") && (themeName !== "")) {
                themeName = themeName.split(" ")[0];
                mainElement.classList.add(themeName);

                if (affectChildren !== false) {
                    addThemeToChildren(mainElement, themeName);
                }
            }
        };

        /**
         * @param {string} themeName
         * @param {boolean} affectChildren = true
         */
        this.removeTheme = function (themeName, affectChildren) {
            if (Class.isInstance(themeName, "string") && (themeName !== "")) {
                themeName = themeName.split(" ")[0];
                mainElement.classList.remove(themeName);

                if (affectChildren !== false) {
                    removeThemeFromChildren(mainElement, themeName);
                }
            }
        };

        /**
         * @param {boolean} affectChildren = true
         */
        this.removeAllThemes = function (affectChildren) {
            mainElement.className = "";

            if (affectChildren !== false) {
                removeAllThemesFromChildren(mainElement);
            }
        };

        /**
         * @param {number} index
         * @returns {string}
         */
        this.getTheme = function (index) {
            return mainElement.classList.item(index);
        };

        /**
         * @param {string themeName}
         * @returns {boolean}
         */
        this.hasTheme = function (themeName) {
            return mainElement.classList.contains(themeName);
        };

        /**
         * @returns {number}
         */
        this.themeCount = function () {
            return mainElement.classList.length;
        };

        /**
         * @returns {string}
         */
        this.toString = function () {
            return "[Tigerian Instance]";
        };

        /**
         * @param {boolean} scrollTo = false
         */
        this.focus = function (scrollTo) {
            mainElement.focus({
                preventScroll: true
            });

            if (scrollTo === true) {
                mainElement.scrollIntoView();
            }
        };

        this.clear = function () {
            var children = mainElement.querySelectorAll("[element-name=\"container\"]");
            for (var i = 0; i < children.length; i++) {
                if (children[i].parentElement === mainElement) {
                    mainElement.removeChild(children[i]);
                }
            }
        };

        //NOTE Attributes
        this.setAttribute("element-name", "");
        this.setAttribute("element-type", "");
        this.setAttribute("visible", "true");
        this.setAttribute("focused", (document.activeElement === mainElement) ? "true" : "false");

        if (Class.isInstance(theme, "string") && (theme !== "")) {
            this.addTheme(theme);
        }

        if (parent !== undefined) {
            // parent.addControl(mainElement);
            parent.addControl(this);
        }
    },
    enums: ["rightToLeft", "leftToRight"],
}, BBind, BStyle, BEvent);