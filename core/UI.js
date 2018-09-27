/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */


'use strict';


/**
 * @implements {Tigerian.BBind}
 * @extends {Tigerian.Class}
 *
 * @constructor
 * @abstract
 */
Tigerian.UI = Tigerian.Class.extend({
    /**
     * @param {Element} [mainElement = window]
     * @param {Tigerian.UI} [parent = undefined]
     * @param {string} [theme]
     */
    init: function (mainElement, parent, theme) {
        this.super();

        if (!Tigerian.Class.isInstance(mainElement, Element)) {
            mainElement = document.body;
        }

        if (!Tigerian.Class.isInstance(parent, Tigerian.UI)) {
            parent = undefined;
        }

        this.config("bind");
        this.config("style", mainElement);

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
         * @member {Tigerin.UI}
         */
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {Tigerian.Application}
             */
            get: function () {
                return parent;
            },
            /**
             * @param {Tigerian.UI} value
             */
            set: function (v) {
                if (v === undefined) {
                    parent = undefined;
                    mainElement.parentNode.removeChild(mainElement);
                } else if (Tigerian.Class.isInstance(v, Tigerian.UI)) {
                    parent = v;
                    v.addControl(this);
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
                if (Tigerian.Class.isInstance(v, "boolean")) {
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
                if (Tigerian.Class.isInstance(v, "boolean")) {
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
         * @param {boolean} value
         */
        function setVisible(value) {
            if (Tigerian.Class.isInstance(value, "boolean")) {
                var lastVisible = (instance.getAttribute("visible") === true);
                instance.setAttribute("visible", value);

                if (lastVisible !== value) {
                    instance.dispatchEvent(Tigerian.Event.onVisibleChanged);
                }
            }
        }

        /**
         * @param {Event} e
         */
        function eventHandler(e) {
            var eventType = e.type.toLowerCase();

            // if (instance.enabled && instance.visible) {
            if (instance.enabled) {
                for (var event in events[eventType]) {
                    events[eventType][event].bind(instance)(e);
                }
            }
        }

        function addThemeToChildren(element, themeName) {
            var elm = new Tigerian.Iterator(Array.from(element.children));
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

        function removeThemeFromChildren(element, themeName) {
            var elm = new Tigerian.Iterator(Array.from(element.children));
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

        function removeAllThemesFromChildren(element) {
            var elm = new Tigerian.Iterator(Array.from(element.children));
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
         * @param {Tigerian.Control} control
         */
        this.addControl = function (control) {
            // console.warn(Tigerian.Class.isInstance(control, Tigerian.Control));
            if (Tigerian.Class.isInstance(control, Element)) {
                mainElement.appendChild(control);
            } else if (Tigerian.Class.isInstance(control, Tigerian.Control)) {
                control.appendTo(this, mainElement);
            }
        }.bind(this);

        /**
         * @param {string} eventName
         * @param {function} callback
         */
        this.addEvent = function (eventName, callback) {
            // console.warn(eventName, callback);
            if ((Tigerian.Class.isInstance(eventName, "string")) && (eventName !== "") && (Tigerian.Class.isInstance(callback, Function))) {
                eventName = eventName.toLowerCase();

                if (!events.hasOwnProperty(eventName)) {
                    mainElement.addEventListener(eventName, eventHandler, true);
                    events[eventName] = [];
                }

                if (events[eventName].indexOf(callback) === -1) {
                    events[eventName].push(callback);
                }
            }
        };

        /**
         * @param {string} eventName
         * @param {EventCallback} [callback]
         */
        this.removeEvent = function (eventName, callback) {
            if ((Tigerian.Class.isInstance(eventName, "string")) && (eventName !== "") && (events[eventName] !== undefined)) {
                eventName = eventName.toLowerCase();

                if (Tigerian.Class.isInstance(callback, Function)) {
                    events[eventName] = events[eventName].filter(function (item, index) {
                        if (item !== callback) {
                            return item;
                        }
                    });
                } else {
                    events[eventName] = [];
                }

                if (events[eventName].length === 0) {
                    mainElement.removeEventListener(eventName, eventHandler, false);
                    delete events[eventName];
                }
            }
        };

        /**
         * @param {Event} e
         * @param {Array} [data]
         */
        this.dispatchEvent = function (e, data) {
            if (Tigerian.Class.isInstance(e, Event)) {
                e.data = data;
                eventHandler(e);
                /*
                 setTimeout(function () {
                 mainElement.dispatchEvent(event);
                 }, 0);
                 */
                // mainElement.dispatchEvent(event);
            }
        };

        /**
         * @param {string} attrName
         * @param {string} attrValue
         */
        this.setAttribute = function (attrName, attrValue) {
            if (Tigerian.Class.isInstance(mainElement, Element) && Tigerian.Class.isInstance(attrName, "string") && (attributesSetProtected.indexOf(attrName) === -1)) {
                mainElement.setAttribute(attrName, attrValue.toString());
            }
        };

        /**
         * @param {string} attrName
         * @returns {string}
         */
        this.getAttribute = function (attrName) {
            if (Tigerian.Class.isInstance(mainElement, Element) && Tigerian.Class.isInstance(attrName, "string")) {
                return mainElement.getAttribute(attrName);
            }
        };

        /**
         * @param {string} attrName
         * @returns {boolean}
         */
        this.hasAttribute = function (attrName) {
            if (Tigerian.Class.isInstance(mainElement, Element) && Tigerian.Class.isInstance(attrName, "string")) {
                return mainElement.hasAttribute(attrName);
            }
        };

        /**
         * @param {string} attrName
         */
        this.removeAttribute = function (attrName) {
            if (Tigerian.Class.isInstance(mainElement, Element) && Tigerian.Class.isInstance(attrName, "string") && (attributesRemoveProtected.indexOf(attrName) === -1)) {
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
         * @param {Tigerian.UI} parentControl
         * @param {Element} elmParentContainer
         */
        this.appendTo = function (parentControl, elmParentContainer) {
            if (Tigerian.Class.isInstance(parentControl, Tigerian.UI) && parentControl.matchContainer(elmParentContainer)) {
                parent = parentControl;
                elmParentContainer.appendChild(mainElement);
            }
        };

        /**
         * @param {string} themeName
         * @param {boolean} affectChildren = true
         */
        this.addTheme = function (themeName, affectChildren) {
            if (Tigerian.Class.isInstance(themeName, "string") && (themeName !== "")) {
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
            if (Tigerian.Class.isInstance(themeName, "string") && (themeName !== "")) {
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

        this.getTheme = function (index) {
            return mainElement.classList.item(index);
        };

        this.hasTheme = function (themeName) {
            return mainElement.classList.contains(themeName);
        };

        this.themeCount = function () {
            return mainElement.classList.length;
        };

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
        }

        //NOTE Attributes
        this.setAttribute("element-name", "");
        this.setAttribute("element-type", "");
        this.setAttribute("visible", "true");
        this.setAttribute("focused", (document.activeElement === mainElement) ? "true" : "false");

        if (Tigerian.Class.isInstance(theme, "string") && (theme !== "")) {
            this.addTheme(theme);
        }

        if (parent !== undefined) {
            // parent.addControl(mainElement);
            parent.addControl(this);
        }
    },
}, Tigerian.BBind, Tigerian.BStyle);