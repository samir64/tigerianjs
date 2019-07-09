import {
  Behavior
} from "../core/Behavior.js";

/**
 * Created by samir on 09/20/18.
 */

("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
export class BFixElement extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    thid.defineMethod("config", (that, stick, ctrlFix) => {
      /**
       * @member {boolean} fixed
       */
      that.defineProperty("fixed", {
        get() {
          return (ctrlFix.getAttribute("fixed") === "true");
        },
        set(v) {
          ctrlFix.setAttribute("fixed", (v === true) ? "true" : "false");
        },
        type: Boolean
      });

      switch (stick) {
        case EFixElement.TOP:
          ctrlFix.setAttribute("stick", "top");
          break;

        case EFixElement.BOTTOM:
          ctrlFix.setAttribute("stick", "bottom");
          break;

        default:
          ctrlFix.setAttribute("stick", "none");
      }

      ctrlFix.setAttribute("fixed", "true");
      that.addControl = ctrlFix.addControl;
    }, [Object, Boolean, Control]);
  }
}

export const EFixElement = Object.freeze({
  TOP: Symbol("top"),
  BOTTOM: Symbol("bottom"),
  NONE: Symbol("none")
});