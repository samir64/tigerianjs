// import {
//   instanceOf,
// } from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";
import {
  Events
} from "../core/Events.js";
import {
  EMethod
} from "../core/UI.js";

/**
 * Created by samir on 9/14/16.
 */

/**
 * @implements {Behavior}
 * @extends {Control}
 * @interface
 * @property {String} text
 */
export class BText extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Control} that 
     * @param {Control} ctrlText 
     * @param {String} [text=""]
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

      that.attribute("text", String, "", (method, value) => {
        switch (method) {
          case EMethod.GET:
            break;

          case EMethod.SET:
            if (instanceOf(value, String)) {
              let lastText = text;
              text = value;
              if (instanceOf(ctrlText, BText)) {
                ctrlText.text = value;
              } else {
                ctrlText.innerHTML = value;
                ctrlText.value = value;
              }

              if (lastText !== value) {
                that.dispatchEvent(Events.onTextChange, {
                  lastValue: lastText
                });
              }
            }
            break;

          default:
        }

        return value;
      });

      /**
       * @member {string}
       */
      // Object.defineProperty(that, "text", {
      //   enumerable: true,
      //   configurable: true,
      //   get() {
      //     let result;

      //     if (instanceOf(ctrlText, BText)) {
      //       result = ctrlText.text;
      //     } else if (instanceOf(ctrlText.value, String)) {
      //       result = ctrlText.value;
      //     } else if (instanceOf(ctrlText.innerHTML, String)) {
      //       result = ctrlText.innerHTML;
      //     } else {
      //       result = text;
      //     }

      //     that.dataset.text = result;

      //     return result;
      //   },
      //   set(v) {
      //     if (instanceOf(v, String)) {
      //       let lastText = text;
      //       text = v;
      //       that.dataset.text = v;
      //       if (instanceOf(ctrlText, BText)) {
      //         ctrlText.text = v;
      //       } else {
      //         ctrlText.innerHTML = v;
      //         ctrlText.value = v;
      //       }

      //       if (lastText !== v) {
      //         that.dispatchEvent(Events.onTextChange, {
      //           lastValue: lastText
      //         });
      //       }
      //     }
      //   }
      // });

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