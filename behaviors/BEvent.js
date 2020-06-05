import {
  instanceOf,
  forEach
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";

("use strict");

export class BEvent extends Behavior {
  constructor() {
    super();

    this.defineMethod("config", (that, element) => {
      let enabled = true;
      let events = [];

      this.element = element;
      delete this.element;

      that.defineProperty("enabled", {
        get() {
          return enabled;
        },
        set(v) {
          enabled = v;
        },
        type: Boolean
      });

      that.defineProperty("element", {
        set(v) {
          if (v !== element) {
            if (element !== undefined) {
              forEach(events, (event, eventName) => {
                element.removeEventListener(eventName, evwentHandler, false);
              });
            }
            if (v !== undefined) {
              forEach(events, (event, eventName) => {
                element.addEventListener(eventName, eventHandler, true);
              });
            }

            element = v;
          }
        },
        type: [Element, undefined]
      })

      /**
       * @param {Event} e
       */
      function eventHandler(e) {
        let eventType = e.type.toLowerCase();

        if (that.enabled) {
          if (eventType in events) {
            forEach(events[eventType], (event) => {
              event.bind(that)(e);
            });
          }
        }
      }

      /**
       * @param {string} eventName
       * @param {function} callback
       */
      that.defineMethod("addEvent", (eventName, callback) => {
        if (instanceOf(eventName, Event)) {
          eventName = eventName.type;
        }

        if (eventName !== "") {
          eventName = eventName.toLowerCase();

          if (!events.hasOwnProperty(eventName)) {
            if (element !== undefined) {
              element.addEventListener(eventName, eventHandler, true);
            }
            events[eventName] = [];
          }

          if (events[eventName].indexOf(callback) === -1) {
            events[eventName].push(callback);
          }
        }
      }, [
        [String, Event], Function
      ]);

      /**
       * @param {string} eventName
       * @param {EventCallback} [callback]
       */
      that.defineMethod("removeEvent", (eventName, callback) => {
        if (instanceOf(eventName, Event)) {
          eventName = eventName.type;
        }

        if (eventName !== "") {
          eventName = eventName.toLowerCase();

          if (instanceOf(callback, Function)) {
            events[eventName] = events[eventName].filter(function (item, index) {
              if (item !== callback) {
                return item;
              }
            });
          } else {
            events[eventName] = [];
          }

          if (events[eventName].length === 0) {
            if (element !== undefined) {
              element.removeEventListener(eventName, eventHandler, false);
            }
            delete events[eventName];
          }
        }
      }, [
        [String, Event],
        [Function, undefined]
      ]);

      /**
       * @param {Event} e
       * @param {Array} [data]
       */
      that.defineMethod("dispatchEvent", (e, data) => {
        e.data = data;
        eventHandler(e);
      }, [Event]);
    }, [Object, [Element, DocumentFragment, XMLHttpRequest]]);
  }
}