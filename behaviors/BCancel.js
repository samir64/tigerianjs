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
     * @param {string} behavior
     * @param {Control} ctrlCancel
     */
    this.defineMethod(
      "config",
      (that, ctrlCancel) => {
        let elmButton = document.createElement("div");

        // elmButton.setAttribute("element-type", "CancelButton");
        elmButton.setAttribute("element-name", "cancel-button");
        elmButton.setAttribute("visible", "true");

        ctrlCancel.setAttribute("closable", "true");

        ctrlCancel.addControl(elmButton);
        /**
         * @member {boolean}
         */
        that.defineProperty("closable", {
          get() {
            return ctrlCancel.getAttribute("closable") === "true";
          },
          set(v) {
            if (instanceOf(v, "boolean")) {
              ctrlCancel.setAttribute("closable", v ? "true" : "false");
              elmButton.setAttribute("visible", v ? "true" : "false");
            }
          },
          type: Boolean
        });

        elmButton.addEventListener(
          "click",
          (e) => {
            that.visible = false;
          },
          true
        );
      },
      [Object, Control, Control]
    );
  }
}