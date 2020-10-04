import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  BGroup
} from "./BGroup.js";

/**
 * Created by samir on 9/10/18.
 */

"use strict";

/**
 * @extends {Behavior}
 * @implements {BGroup}
 * @interface
 */
export class BSelectGroup extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     * @param {Control} ctrlSelectGroup 
     */
    this.config = (that, ctrlSelectGroup) => {
      //NOTE Private Variables
      let itemIndex = -1;
      let multi = false;

      that.config(BGroup, ctrlSelectGroup);

      //NOTE Properties
      /**
       * @member {number}
       */
      Object.defineProperty(that, "itemIndex", {
        enumerable: true,
        configurable: true,
        get() {
          return itemIndex;
        },
        set(v) {
          if (v < -1) {
            v = -1;
          }
          if (v >= that.itemCount) {
            v = that.itemCount;
          }

          if (v !== itemIndex) {
            if (itemIndex !== -1) {
              that.getItem(itemIndex).dataset.focused = "false";
            }
            if ((v >= 0) && (v < that.itemCount)) {
              that.getItem(v).dataset.focused = "true";
            }
            itemIndex = v;

            that.dispatchEvent(Events.onItemIndexChange);
          }

          that.focus();
        }
      });

      /**
       * @member {number|number[]}
       */
      Object.defineProperty(that, "selectedIndex", {
        enumerable: true,
        configurable: true,
        get() {
          /**
           * @type {number|number[]}
           */
          let result = (multi ? [] : -1);
          for (let i = 0; i < that.itemCount; i++) {
            if (that.getItem(i).selected) {
              if (multi) {
                result.push(i);
              } else {
                if (result === -1) {
                  result = i;
                } else {
                  that.getItem(i).selected = false;
                }
              }
            }
          }
          return result;
        },
        /**
         * @param {number|number[]} v
         */
        set(v) {
          lastSelectedIndex = selectedIndex;


          if ((v === -1) || (v === [])) {
            for (let i = 0; i < that.itemCount; i++) {
              that.getItem(i).selected = false;
            }
            that.focus();
          } else {
            if (instanceOf(v, "number")) {
              v = ((v < -1) ? -1 : ((v >= that.itemCount) ? that.itemCount - 1 : v));

              for (let i = 0; i < that.itemCount; i++) {
                that.getItem(i).selected = (v === i);
                if (v === i) {
                  that.getItem(i).focus();
                  that.itemIndex = i;
                }
              }
            } else if (multi && instanceOf(v, Array)) {
              /**
               * @param {number} n
               * @param {number} idx
               * @param {Array} arr
               * @returns {boolean|*}
               * @this BSelectGroup
               */
              function getValidItems(n, idx, arr) {
                return (instanceOf(n, "number") && (n >= 0) && (n < that.itemCount) && (arr.indexOf(n, idx + 1) === -1));
              }

              v = v.sort((a, b) => {
                return a >= b;
              }).filter(getValidItems, that);

              for (let i = 0; i < that.itemCount; i++) {
                let select = (v.indexOf(i) >= 0);
                that.getItem(i).selected = select;

                if (select) {
                  that.itemIndex = i;
                }
              }
            }
          }

          if (!compare(lastSelectedIndex, v)) {
            that.dispatchEvent(Events.onSelectedIndexChange, {
              lastSelectedIndex: lastSelectedIndex
            });
          }

          if (that.selectedCount !== lastSelectedCount) {
            that.dispatchEvent(Events.onSelectedCountChange, {
              lastSelectedCount: lastSelectedCount
            });
            lastSelectedCount = that.selectedCount;
          }
        }
      });

      /**
       * @member {number}
       */
      Object.defineProperty(that, "selectedCount", {
        enumerable: true,
        configurable: true,
        get() {
          if (multi) {
            return that.selectedIndex.length;
          } else {
            return ((that.selectedIndex === -1) ? 0 : 1);
          }
        }
      });

      /**
       * @member {boolean}
       */
      Object.defineProperty(that, "multiSelect", {
        enumerable: true,
        configurable: true,
        get() {
          return multi;
        },
        set(v) {
          multi = v;

          if (v) {
            for (let i = 0; i < that.itemCount; i++) {
              that.getItem(i).autoDeselect = true;
            }
          } else {
            for (let i = 0; i < that.itemCount; i++) {
              if ((that.selectedCount > 1) && (i !== that.itemIndex)) {
                that.getItem(i).selected = false;
              }
              that.getItem(i).autoDeselect = false;
            }
          }
        }
      });

      //NOTE Public Functions
      that.selectAll = () => {
        if (that.multiSelect) {
          for (let i = 0; i < that.itemCount; i++) {
            that.getItem(i).selected = true;
          }
        }
      };

      that.selectNone = () => {
        for (let i = 0; i < that.itemCount; i++) {
          that.getItem(i).selected = false;
        }
      };

      /**
       * @param {Function} func
       */
      that.sort = (func) => {
        superSort(func);
        lastSelectedIndex = that.selectedIndex;
      };

      //NOTE Private Functions
      /**
       * @param {Event} e
       */
      let onSelectedChange = (e) => {
        for (let i = 0; i < that.itemCount; i++) {
          if (that !== that.getItem(i)) {
            if (!that.multiSelect && that.selected && that.getItem(i).selected) {
              that.getItem(i).selected = false;
            }
          } else {
            that.itemIndex = i;
          }
        }

        if (!compare(lastSelectedIndex, that.selectedIndex)) {
          that.dispatchEvent(Events.onSelectedIndexChange, {
            lastSelectedIndex: lastSelectedIndex
          });
        }

        if (that.selectedCount !== lastSelectedCount) {
          that.dispatchEvent(Events.onSelectedCountChange, {
            lastSelectedCount: lastSelectedCount
          });
        }

        lastSelectedCount = that.selectedCount;
        lastSelectedIndex = that.selectedIndex;
      }

      /**
       * @param {Event} e
       * @param {Array} params
       */
      let onAddItem = (e) => {
        e.data.addedItem.dataset.focused = "false";
        e.data.addedItem.addEvent("selectedchange", onSelectedChange);
      }

      /**
       * @param {Event} e
       */
      let onKeyDown = (e) => {
        let itemIndex = Math.min(Math.max(0, that.itemIndex), that.itemCount);

        let setIndex = () => {
          if (that.getItem(itemIndex).enabled) {
            that.itemIndex = itemIndex;
          }

          if (!that.multiSelect) {
            that.selectedIndex = that.itemIndex;
          }
          e.preventDefault();
        }

        if (that.focused) {
          switch (e.code) {
            case "ArrowDown":

              while ((itemIndex < that.itemCount - 1) && !that.getItem(++itemIndex).enabled);
              setIndex();
              break;

            case "ArrowUp":
              while ((itemIndex > 0) && !that.getItem(--itemIndex).enabled);
              setIndex();
              break;

            case "Space":
              if (that.multiSelect) {
                if (!that.getItem(that.itemIndex).selected || that.getItem(that.itemIndex).autoDeselect) {
                  that.getItem(that.itemIndex).selected = !that.getItem(that.itemIndex).selected;
                  if (!compare(lastSelectedIndex, that.selectedIndex)) {
                    that.getItem(that.itemIndex).dispatchEvent(Events.onSelectedChange, {
                      lastSelectedIndex: lastSelectedIndex
                    });
                  }
                  lastSelectedIndex = that.selectedIndex;
                }
                e.preventDefault();
              }
              break;

            default:
              break;
          }
        }
      }

      /**
       * @param {Event} e
       */
      let onFocus = (e) => {
        if ((that.itemIndex < 0) || (that.itemIndex >= that.itemCount)) {
          that.itemIndex = 0;
        }
        if (!that.multiSelect && (that.itemIndex !== that.selectedIndex)) {
          that.itemIndex = that.selectedIndex;
        }

        if (that.itemIndex >= 0) {
          that.getItem(that.itemIndex).dataset.focused = "true";
        }
      }

      //NOTE Default Events
      that.addEvent("keydown", onKeyDown);
      that.addEvent("focus", onFocus);
      window.addEventListener("keydown", ((e) => {
        if (that.focuesd) {
          e.preventDefault();
        }
      }).bind(that));
      that.addEvent("Add", onAddItem);
    };
  }
}