import {
  instanceOf,
  defineMethod
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

("use strict");


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

    this.defineMethod("config", (that, ctrlText, text = "") => {
      if (instanceOf(ctrlText, Element)) {
        ctrlText.setAttribute("element-name", "text");
      }

      function changeText(e) {
        if (instanceOf(ctrlText, BText)) {
          that.text = ctrlText.text;
        } else {
          that.text = (instanceOf(e.target.value, String) ? e.target.value : e.target.innerHTML);
        }
      }

      defineMethod(that, "bindable", () => {
        var start = 0;
        while (start >= 0) {
          start = text.search(/<control\s+|<variable\s+/, start);
        }
      });

      /**
       * @member {string}
       */
      that.defineProperty("text", {
        get() {
          var result;

          if (ctrlText["Behavior:text"]) {
            result = ctrlText.text;
          } else if (instanceOf(ctrlText.value, String)) {
            result = ctrlText.value;
          } else if (instanceOf(ctrlText.innerHTML, String)) {
            result = ctrlText.innerHTML;
          } else {
            result = text;
          }

          that.setAttribute("text", result);

          return result;
        },
        set(v) {
          if (instanceOf(v, String)) {
            var lastText = text;
            text = v;
            that.setAttribute("text", v);
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
        },
      });

      if (instanceOf(ctrlText, Control)) {
        ctrlText.addEvent("change", changeText);
        ctrlText.addEvent("input", changeText);
      } else {
        ctrlText.addEventListener("change", changeText);
        ctrlText.addEventListener("input", changeText);
      }

      that.text = text;
    }, [Object, [Element, Control]]);
  }
}