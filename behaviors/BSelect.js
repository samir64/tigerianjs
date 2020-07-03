import {
  Behavior
} from "../core/Behavior.js";
import {
  Events
} from "../core/Events.js";

/**
 * Created by samir on 9/7/18.
 */

("use strict");

/**
 * @extends {Behavior}
 * @interface
 */
export class BSelect extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     */
    this.config = (that) => {
      //NOTE Private Variables
      let autoSelect = true;
      let autoDeselect = true;

      //NOTE Attributes
      that.setAttribute("selected", "false");

      //NOTE Properties
      /**
       * @member {boolean}
       */
      Object.defineProperty(that, "autoSelect", {
        enumerable: true,
        configurable: true,
        get() {
          return autoSelect;
        },
        set(v) {
          autoSelect = v;
        }
      });

      /**
       * @member {boolean}
       */
      Object.defineProperty(that, "autoDeselect", {
        enumerable: true,
        configurable: true,
        get() {
          return autoDeselect;
        },
        set(v) {
          autoDeselect = v;
        }
      });

      /**
       * @member {boolean}
       */
      Object.defineProperty(that, "selected", {
        enumerable: true,
        configurable: true,
        get() {
          return (that.getAttribute("selected") === "true");
        },
        set(v) {
          that.setAttribute("selected", v);
        }
      });

      //NOTE Private Functions
      /**
       * @param {Event} e
       */
      let onClick = (e) => {
        let lastValue = that.selected;
        if (!that.selected) {
          if (that.autoSelect) {
            that.selected = true;
          }
        } else {
          if (that.autoDeselect) {
            that.selected = false;
          }
        }
        if (that.selected !== lastValue) {
          that.dispatchEvent(Events.onSelectedChange, {
            lastValue: lastValue
          });
        }
      }

      /**
       * @param {Event} e
       */
      let onKeyDown = (e) => {
        let lastValue = that.selected;
        if (!that.selected) {
          if (that.autoSelect && ((e.keyCode === 32) || (e.keyCode === 13))) {
            that.selected = true;
            e.preventDefault();
            that.focus();
          }
        } else {
          if (that.autoDeselect && ((e.keyCode === 32) || (e.keyCode === 13))) {
            that.selected = false;
            e.preventDefault();
            that.focus();
          }
        }
        if (that.selected !== lastValue) {
          that.dispatchEvent(Events.onSelectedChange, {
            lastValue: lastValue
          });
        }
      }


      //NOTE Default Events
      that.addEvent("click", onClick.bind(that));
      that.addEvent("keydown", onKeyDown.bind(that));
    };
  }
}