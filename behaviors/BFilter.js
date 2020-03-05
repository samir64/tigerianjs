import {
  instanceOf,
  forEach
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";

/**
 * Created by samir on 9/14/16.
 */

("use strict");

/**
 * @implements {Behavior}
 * @extends {Control}
 * @interface
 */
export class BFilter extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.defineMethod("config", (that, ctrlText, ctrlList) => {
      that.setAttribute("filtering", ctrlList.filter ? "true" : "false");

      /**
       * @param {string} text
       */
      that.defineMethod("filter", (text) => {
        if (!instanceOf(text, String)) {
          text = ctrlText.text;
        }

        if (that.filtering) {
          forEach(ctrlList, (item) => {
            item.visible =
              text === "" ||
              item.text.toLowerCase().includes(text.toLowerCase());
          });
        }
      });

      /**
       * @member {boolean}
       * @this {Control}
       */
      that.defineProperty("filtering", {
        get() {
          return (this.getAttribute("filtering") === "true");
        },
        set(v) {
          this.setAttribute("filtering", (v === true) ? "true" : "false");
          if (this !== ctrlList) {
            ctrlList.filter = v;
          }
        },
        type: Boolean
      });

      ctrlText.addEvent("input", (e) => {
        that.filter();
      });

      // that.filter();
    }, [Object, BText, BGroup]);
  }
}