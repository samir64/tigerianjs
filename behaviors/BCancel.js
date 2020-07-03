import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";

("use strict");

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
      elmButton.setAttribute("element-name", "cancel-button");
      elmButton.setAttribute("visible", "true");

      ctrlCancel.setAttribute("closable", "true");

      ctrlCancel.addControl(elmButton);
      /**
       * @member {boolean}
       */
      Object.defineProperty(that, "closable", {
        enumerable: true,
        configurable: true,
        get() {
          return ctrlCancel.getAttribute("closable") === "true";
        },
        set(v) {
          if (instanceOf(v, "boolean")) {
            ctrlCancel.setAttribute("closable", v ? "true" : "false");
            elmButton.setAttribute("visible", v ? "true" : "false");
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