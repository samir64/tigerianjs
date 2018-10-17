"use strict";

Tigerian.BEvent = Tigerian.Behavior.extend({
    init: function () {
        this.super("event");

        var instance = this;
        var enabled = true;
        var events = [];
        var mainElement;

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            get: function () {
                return enabled;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    enabled = v;
                }
            }
        });

        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            // get: function () {
            //     return mainElement;
            // },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, Element) || (v === undefined)) {
                    if (mainElement !== undefined) {
                        for (var eventName in events) {
                            mainElement.removeEventListener(eventName, eventHandler, false);
                        }
                    }

                    if (v !== undefined) {
                        for (var eventName in events) {
                            mainElement.addEventListener(eventName, eventHandler, true);
                        }
                    }

                    mainElement = v;
                }
            },
        });

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

        /**
         * @param {string} eventName
         * @param {function} callback
         */
        this.addEvent = function (eventName, callback) {
            // console.warn(eventName, callback);
            if ((Tigerian.Class.isInstance(eventName, "string")) && (eventName !== "") && (Tigerian.Class.isInstance(callback, Function))) {
                eventName = eventName.toLowerCase();

                if (!events.hasOwnProperty(eventName)) {
                    if (mainElement !== undefined) {
                        mainElement.addEventListener(eventName, eventHandler, true);
                    }
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
                    if (mainElement !== undefined) {
                        mainElement.removeEventListener(eventName, eventHandler, false);
                    }
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
            }
        };
    },
    config: function (behavior, element) {
        if ((behavior === "event") && (Tigerian.Class.isInstance(element, Element) || (element === undefined))) {
            this.element = element;

            delete this.element;
        }
    },
});