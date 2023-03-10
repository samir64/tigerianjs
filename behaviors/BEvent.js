import {
  instanceOf,
  forEach
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";

export class BEvent extends Behavior {
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     * @param {Element|DocumentFragment|XMLHttpRequest} element 
     */
    this.config = (that, element) => {
      let enabled = true;
      let events = [];

      // this.element = element;
      // delete this.element;

      Object.defineProperty(that, "enabled", {
        enumerable: true,
        configurable: true,
        get() {
          return enabled;
        },
        set(v) {
          enabled = v;
        }
      });

      Object.defineProperty(that, "element", {
        enumerable: true,
        configurable: true,
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
        }
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
       * @param {String|Event} eventName
       * @param {Function} callback
       */
      that.addEvent = (eventName, callback) => {
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
      };

      /**
       * @param {String|Event} eventName
       * @param {Function} [callback]
       */
      that.removeEvent = (eventName, callback) => {
        if (instanceOf(eventName, Event)) {
          eventName = eventName.type;
        }

        if (eventName !== "") {
          eventName = eventName.toLowerCase();

          if (instanceOf(callback, Function)) {
            events[eventName] = events[eventName].filter((item, index) => {
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
      };

      /**
       * @param {Event} e
       * @param {Array} [data]
       */
      that.dispatchEvent = (e, data) => {
        e.data = data;
        eventHandler(e);
      };
    };
  }
}