("use strict");

BEvent = Behavior.extend({
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
                if (Class.isInstance(v, "boolean")) {
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
                if (Class.isInstance(v, Element) || (v === undefined)) {
                    if (mainElement !== undefined) {
                        events.forEach(function (event, eventName) {
                            mainElement.removeEventListener(eventName, eventHandler, false);
                        });
                        /* for (var eventName in events) {
                            mainElement.removeEventListener(eventName, eventHandler, false);
                        } */
                    }

                    if (v !== undefined) {
                        events.forEach(function (event, eventName) {
                            mainElement.addEventListener(eventName, eventHandler, true);
                        });
                        /* for (var eventName in events) {
                            mainElement.addEventListener(eventName, eventHandler, true);
                        } */
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
                if (eventType in events) {
                    events[eventType].forEach(function (event) {
                        event.bind(instance)(e);
                    });
                }
                /* for (var event in events[eventType]) {
                    events[eventType][event].bind(instance)(e);
                } */
            }
        }

        /**
         * @param {string} eventName
         * @param {function} callback
         */
        this.addEvent = function (eventName, callback) {
            // console.warn(eventName, callback);
            if ((Class.isInstance(eventName, "string")) && (eventName !== "") && (Class.isInstance(callback, Function))) {
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
            if ((Class.isInstance(eventName, "string")) && (eventName !== "") && (events[eventName] !== undefined)) {
                eventName = eventName.toLowerCase();

                if (Class.isInstance(callback, Function)) {
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
            if (Class.isInstance(e, Event)) {
                e.data = data;
                eventHandler(e);
            }
        };
    },
    /**
     * @param {string} behavior
     * @param {Element} element
     */
    config: function (behavior, element) {
        if ((behavior === "event") && (Class.isInstance(element, Element) || (element === undefined))) {
            this.element = element;

            delete this.element;
        }
    },
});