import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";

/**
 * Created by samir on 09/20/18.
 */

"use strict";

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

    /**
     * @param {Object} that 
     * @param {Symbol} stick 
     * @param {Control} ctrlFix 
     */
    this.config = (that, stick = EFixElement.NONE, ctrlFix = undefined) => {
      if (ctrlFix === undefined) {
        ctrlFix = that;
      }

      /**
       * @member {boolean} fixed
       */
      Object.defineProperty(that, "fixed", {
        enumerable: true,
        configurable: true,
        get() {
          return (ctrlFix.dataset.fixed === "true");
        },
        set(v) {
          ctrlFix.dataset.fixed = v;
        }
      });

      switch (stick) {
        case EFixElement.TOP:
          ctrlFix.dataset.stick = "top";
          break;

        case EFixElement.BOTTOM:
          ctrlFix.dataset.stick = "bottom";
          break;

        default:
          ctrlFix.dataset.stick = "none";
      }

      ctrlFix.dataset.fixed = "true";
      that.addControl = ctrlFix.addControl;
    };
  }
}

export const EFixElement = Object.freeze({
  TOP: Symbol("top"),
  BOTTOM: Symbol("bottom"),
  NONE: Symbol("none")
});