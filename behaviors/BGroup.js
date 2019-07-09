import {
  instanceOf,
  forEach
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import { Control } from "../core/Control.js";

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
      var items = {};

      that.config(BIterator, items);

      //NOTE Properties
      /**
       * @member {number}
       */
      that.defineProperty("itemCount", {
        get() {
          return items.list.length;
        }
      });

      /**
       * @member {boolean}
       */
      that.defineProperty("focused", {
        get() {
          var isActive = superFocused.get();
          for (var i = 0; i < ctrlGroup.itemCount && !isActive; i++) {
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
      that.defineMethod("addItem", (item) => {
        var found = false;

        forEach(items.list, (it, index) => {
          if (item === it) {
            found = true;
          }
        });

        if (!found) {
          items.list.push(item);
          ctrlGroup.addControl(item);

          that.dispatchEvent(Events.onAdd, {
            addedItem: item
          });

          item.addEvent("Remove", function (e) {
            forEach(that, (it, index) => {
              if (item === it) {
                initRemoveItem(index);
              }
            });

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
          itemIndex < items.list.length
        ) {
          return items.list[itemIndex];
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
          itemIndex < items.list.length
        ) {
          items.list = items.list.filter(function (item, index) {
            if (index !== itemIndex) {
              return item;
            } else {
              item.remove();
            }
          });
          ctrlGroup.removeItem(itemIndex);
        } else {
          throw new Error("Index out of range");
        }
      }, [Number]);

      that.defineMethod("clear", () => {
        items.list = items.list.filter(function (item, itemIndex) {
          item.remove();
          return false;
        });

        ctrlGroup.clear();
      });

      /**
       * @param {function} func
       */
      that.defineMethod("sort", (func) => {
        items.list = items.list.sort(func);

        ctrlGroup.clear();
        forEach(items, (item, index) => {
          ctrlGroup.addItem(item);
        });
      }, [Function]);
    }, [Control]);
  }
}