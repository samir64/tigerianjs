/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */


'use strict';


/**
 * @param {Element} [mainElement = window]
 * @param {Tigerian} [parent = undefined]
 * @param {Function|Function[]} [...interfaces]
 *
 * @property {boolean} enabled
 * @property {boolean} visible
 * @property {boolean} autoVisible
 * @property {string} style
 *
 * @function bind (srcProp, target, trgProp)
 *
 * @constructor
 * @abstract
 */
Tigerian.UI = Tigerian.Class.extend({
    init: function (mainElement, parent, theme) {
        if (!Tigerian.Class.isInstance(mainElement, Element)) {
            mainElement = document.body;
        }

        if (!Tigerian.Class.isInstance(parent, Tigerian.UI)) {
            parent = undefined;
        }

        if (parent !== undefined) {
            parent.addControl(mainElement);
        }

        //NOTE Private Constants
        /**
         * @type {string[]}
         */
        var attributesSetProtected = [];
        /**
         * @type {string[]}
         */
        var attributesRemoveProtected = attributesSetProtected.concat(["enabled", "visible", "element-name", "element-type"]);


        //NOTE Private Variables
        var instance = this;
        /**
         * @type {{}}
         */
        var events = {};
        var autoVisible = true;


        //NOTE Properties
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
             * @param {Tigerian.Application|Tigerian.Control} value
             */
            set: function (value) {
                if (value === undefined) {
                    parent = undefined;
                    mainElement.parentNode.removeChild(mainElement);
                    if (theme === true) {
                        mainElement.className = "";
                    }
                } else if (Tigerian.Class.isInstance(value, Tigerian.UI)) {
                    parent = value;
                    value.addControl(mainElement);
                    if (theme === true) {
                        mainElement.className = value.theme;
                    }
                }
            }
        });

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
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    if (value === false) {
                        this.setAttribute("disabled", "true");
                    } else {
                        this.removeAttribute("disabled");
                    }
                }
            }
        });

        Object.defineProperty(this, "visible", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                // return (elmDivContainer.style.display != "none");
                return (this.getAttribute("visible") === "true");
            },
            /**
             * @param {boolean} value
             */
            set: function (value) {
                setVisible(value);
            }
        });

        Object.defineProperty(this, "autoVisible", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return autoVisible;
            },
            /**
             * @param {boolean} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "boolean")) {
                    autoVisible = value;

                    setVisible(this.visible);
                }
            }
        });

        Object.defineProperty(this, "theme", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {string}
             */
            get: function () {
                return mainElement.className;
            },
            /**
             * @param {string} value
             */
            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    mainElement.className = value;
                }
            }
        });


        //NOTE Private Functions
        /**
         * @param {boolean} value
         */
        function setVisible(value) {
            if (Tigerian.Class.isInstance(value, "boolean")) {
                instance.setAttribute("visible", value);
                if (autoVisible) {
                    mainElement.style.display = (value ? "" : "none");
                } else {
                    mainElement.style.display = "";
                }
            }
        }

        /**
         * @param {Event} e
         * @param {Array} parameters
         */
        function eventHandler(e, parameters) {
            var eventType = e.type.toLowerCase();

            if (instance.enabled && instance.visible) {
                for (var event in events[eventType]) {
                    events[eventType][event].bind(instance)(e, parameters);
                }
            }
        }


        //NOTE Public Functions
        this.remove = function () {
            this.parent = undefined
        };

        /**
         * @param {Element|Tigerian.Control} control
         */
        this.addControl = function (control) {
            if (Tigerian.Class.isInstance(control, Element)) {
                mainElement.appendChild(control);
            } else if (Tigerian.Class.isInstance(control, Tigerian.Control)) {
                control.appendTo(instance, mainElement);
            }
        };

        /**
         * @param {string} eventName
         * @param {EventCallback} callback
         */
        this.addEvent = function (eventName, callback) {
            if ((Tigerian.Class.isInstance(eventName, "string")) && (eventName !== "") && (Tigerian.Class.isInstance(callback, Function))) {
                eventName = eventName.toLowerCase();

                if (!events.hasOwnProperty(eventName)) {
                    mainElement.addEventListener(eventName, eventHandler, true);
                    events[eventName] = [];
                }

                events[eventName].push(callback);
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

                if (events[eventName].length == 0) {
                    mainElement.removeEventListener(eventName, eventHandler, false);
                    delete events[eventName];
                }
            }
        };

        /**
         * @param {Event} e
         * @param {Array} [parameters]
         */
        this.dispatchEvent = function (e, parameters) {
            if (Tigerian.Class.isInstance(e, Event)) {
                eventHandler(e, parameters);
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
            if (Tigerian.Class.isInstance(mainElement, Element) && Tigerian.Class.isInstance(attrName, "string") && (Tigerian.Class.isInstance(attrValue, "string") || Tigerian.Class.isInstance(attrValue, "number") || Tigerian.Class.isInstance(attrValue, "boolean")) && (attributesSetProtected.indexOf(attrName) == -1)) {
                mainElement.setAttribute(attrName, attrValue);
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
        this.hasContainer = function (elmContainer) {
            return elmContainer === mainElement;
        };

        /**
         * @param {Tigerian} control
         * @param {Element} elmContainer
         */
        this.appendTo = function (control, elmContainer) {
            if (Tigerian.Class.isInstance(control, Tigerian.Control) && control.hasContainer(elmContainer)) {
                parent = control;
                // var lastChild = elmContainer.lastChild;
                // elmContainer.insertBefore(mainElement, lastChild);
                elmContainer.appendChild(mainElement);
            }
        };

        this.toString = function () {
            return "[Tigerian Instance]";
        };


        //NOTE Attributes
        this.setAttribute("element-name", "");
        this.setAttribute("element-type", "");
        // this.setAttribute("disabled", "false");
        this.setAttribute("visible", "true");

        if (Tigerian.Class.isInstance(theme, "string")) {
            this.theme = theme;
        }
    },
}, Tigerian.BBind);