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

    /**
     * 
     * @param {Object} that 
     * @param {BText} ctrlText 
     * @param {BGroup} ctrlList 
     */
    this.config = (that, ctrlText, ctrlList) => {
      that.dataset.filtering = ctrlList.filter;

      /**
       * @param {String} text
       */
      that.filter = (text) => {
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
      };

      /**
       * @member {boolean}
       * @this {Control}
       */
      Object.defineProperty(that, "filtering", {
        enumerable: true,
        configurable: true,
        get() {
          return (this.dataset.filtering === "true");
        },
        set(v) {
          this.dataset.filtering = v;
          if (this !== ctrlList) {
            ctrlList.filter = v;
          }
        }
      });

      ctrlText.addEvent("input", (e) => {
        that.filter();
      });

      // that.filter();
    };
  }
}