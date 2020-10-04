import {
  instanceOf,
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";
import {
  Events
} from "../core/Events.js";

/**
 * Created by samir on 9/14/16.
 */

"use strict";

/**
 * @implements {Behavior}
 * @extends {Control}
 * @interface
 */
export class BText extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Tigerian} that 
     * @param {Control} ctrlText 
     * @param {String} text 
     */
    this.config = (that, ctrlText, text = "") => {
      if (instanceOf(ctrlText, Element)) {
        ctrlText.dataset.elementName = "text";
      }

      function changeText(e) {
        if (instanceOf(ctrlText, BText)) {
          that.text = ctrlText.text;
        } else {
          that.text = instanceOf(e.target.value, String) ?
            e.target.value :
            e.target.innerHTML;
        }
      }

      /**
       * @member {string}
       */
      Object.defineProperty(that, "text", {
        enumerable: true,
        configurable: true,
        get() {
          let result;

          if (ctrlText["Behavior:text"]) {
            result = ctrlText.text;
          } else if (instanceOf(ctrlText.value, String)) {
            result = ctrlText.value;
          } else if (instanceOf(ctrlText.innerHTML, String)) {
            result = ctrlText.innerHTML;
          } else {
            result = text;
          }

          that.dataset.text = result;

          return result;
        },
        set(v) {
          if (instanceOf(v, String)) {
            let lastText = text;
            text = v;
            that.dataset.text = v;
            if (ctrlText["Behavior:text"]) {
              ctrlText.text = v;
            } else {
              ctrlText.innerHTML = v;
              ctrlText.value = v;
            }

            if (lastText !== v) {
              that.dispatchEvent(Events.onTextChange, {
                lastValue: lastText
              });
            }
          }
        }
      });

      if (instanceOf(ctrlText, Control)) {
        ctrlText.addEvent("change", changeText);
        ctrlText.addEvent("input", changeText);
      } else {
        ctrlText.addEventListener("change", changeText);
        ctrlText.addEventListener("input", changeText);
      }

      that.text = text;
    };
  }
}