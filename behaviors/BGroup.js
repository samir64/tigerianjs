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

/**
 * @implements {Behavior}
 * @implements {BIterator}
 * @extends {Control}
 * @interface
 */
export class BGroup extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     * @param {Control} ctrlGroup 
     */
    this.config = (that, ctrlGroup) => {
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
      Object.defineProperty(that, "itemCount", {
        enumerable: true,
        configurable: true,
        get() {
          return items.length;
        }
      });

      /**
       * @member {boolean}
       */
      Object.defineProperty(that, "focused", {
        enumerable: true,
        configurable: true,
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
      that.addControl = (item) => {
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

          item.addEvent("Remove", (e) => {
            items = items.filter((it, index) => {
              return (it !== item);
            });

            that.config(BIterator, items);

            that.dispatchEvent(Events.onRemove, {
              removedItem: item
            });
          });
        }
      };

      /**
       * @param {Number} itemIndex
       * @returns {Control}
       */
      that.getItem = (itemIndex) => {
        if (
          itemIndex >= 0 &&
          itemIndex < items.length
        ) {
          return items[itemIndex];
        } else {
          throw new Error("Index out of range");
        }
      };

      /**
       * @param {Number} itemIndex
       */
      that.removeItem = (itemIndex) => {
        if (
          itemIndex >= 0 &&
          itemIndex < items.length
        ) {
          items = items.filter((item, index) => {
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
      };

      that.clear = () => {
        items = items.filter((item, itemIndex) => {
          item.remove();
          return false;
        });

        that.config(BIterator, items);
        ctrlGroup.clear();
      };

      /**
       * @param {Function} func
       */
      that.sort = (func) => {
        items = items.sort(func);

        ctrlGroup.clear();
        forEach(items, (item, index) => {
          ctrlGroup.addControl(item);
        });
      };
    };
  }
}