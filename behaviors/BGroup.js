import {
  instanceOf,
  forEach
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";
import {
  BIterator
} from "./BIterator.js";
import {
  Events
} from "../core/Events.js";

/**
 * Created by samir on 9/14/16.
 */

("use strict");

/**
 * @implements {Behavior}
 * @extends {Control}
 * @interface
 */
export class BGroup extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.defineMethod("config", (that, ctrlGroup) => {
      //NOTE Private Members
      /**
       * @type {Control[]}
       */
      let items = [];
      let superAddControl = ctrlGroup.addControl;

      that.config(BIterator, items);

      //NOTE Properties
      /**
       * @member {number}
       */
      that.defineProperty("itemCount", {
        get() {
          return items.length;
        }
      });

      /**
       * @member {boolean}
       */
      that.defineProperty("focused", {
        get() {
          let isActive = superFocused.get();
          for (let i = 0; i < ctrlGroup.itemCount && !isActive; i++) {
            isActive = ctrlGroup.getItem(i).focused;
          }
          return isActive;
        },
        set(v) {
          if (isInstance(v, "boolean")) {
            if (v) {
              that.focus();
            }
          }
        }
      });

      //NOTE Public Functions
      /**
       * @param {Control} item
       */
      that.defineMethod("addControl", (item) => {
        let found = false;

        forEach(items, (it, index) => {
          if (item === it) {
            found = true;
          }
        });

        if (!found) {
          items.push(item);
          superAddControl(item);

          that.dispatchEvent(Events.onAdd, {
            addedItem: item
          });

          item.addEvent("Remove", function (e) {
            items = items.filter((it, index) => {
              return (it !== item);
            });

            that.config(BIterator, items);

            that.dispatchEvent(Events.onRemove, {
              removedItem: item
            });
          });
        }
      }, [Control]);

      /**
       * @param {number} itemIndex
       * @returns {Control}
       */
      that.defineMethod("getItem", (itemIndex) => {
        if (
          itemIndex >= 0 &&
          itemIndex < items.length
        ) {
          return items[itemIndex];
        } else {
          throw new Error("Index out of range");
        }
      }, [Number]);

      /**
       * @param {number} itemIndex
       */
      that.defineMethod("removeItem", (itemIndex) => {
        if (
          itemIndex >= 0 &&
          itemIndex < items.length
        ) {
          items = items.filter(function (item, index) {
            if (index !== itemIndex) {
              return item;
            } else {
              item.remove();
            }
          });
          that.config(BIterator, items);
          ctrlGroup.removeItem(itemIndex);
        } else {
          throw new Error("Index out of range");
        }
      }, [Number]);

      that.defineMethod("clear", () => {
        items = items.filter(function (item, itemIndex) {
          item.remove();
          return false;
        });

        that.config(BIterator, items);
        ctrlGroup.clear();
      });

      /**
       * @param {function} func
       */
      that.defineMethod("sort", (func) => {
        items = items.sort(func);

        ctrlGroup.clear();
        forEach(items, (item, index) => {
          ctrlGroup.addControl(item);
        });
      }, [Function]);
    }, [Control]);
  }
}