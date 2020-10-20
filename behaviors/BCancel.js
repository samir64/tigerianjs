import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";

/**
 * @constructor
 * @extends {Behavior}
 */
export class BCancel extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * @param {Object} that
     * @param {Control} ctrlCancel
     */
    this.config = (that, ctrlCancel) => {
      let elmButton = document.createElement("div");

      // elmButton.setAttribute("element-type", "CancelButton");
      elmButton.dataset.elementName = "cancel-button";
      elmButton.dataset.visible = "true";

      ctrlCancel.dataset.closable = "true";

      ctrlCancel.addControl(elmButton);
      /**
       * @member {boolean}
       */
      Object.defineProperty(that, "closable", {
        enumerable: true,
        configurable: true,
        get() {
          return ctrlCancel.dataset.closable === "true";
        },
        set(v) {
          if (instanceOf(v, "boolean")) {
            ctrlCancel.dataset.closable = v;
            elmButton.dataset.visible = v;
          }
        }
      });

      elmButton.addEventListener(
        "click",
        (e) => {
          that.visible = false;
        },
        true
      );
    };
  }
}