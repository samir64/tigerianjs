import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";

"use strict";

export class BLabel extends Behavior {
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     * @param {Control} ctrlLabel 
     */
    this.config = (that, ctrlLabel) => {
      let labelType = ELabel.NONE;

      that.dataset.labelType = "";

      /**
       * @member {ELabel} labelType
       */
      Object.defineProperty(that, "labelType", {
        enumerable: true,
        configurable: true,
        get() {
          return labelType;
        },
        set(v) {
          switch (v) {
            case BLabel.ETag:
              labelType = v;
              that.dataset.labelType = "tag";
              break;
            case BLabel.EBadge:
              labelType = v;
              that.dataset.labelType = "badge";
              break;
            case BLabel.ENone:
            default:
              labelType = v;
              that.dataset.labelType = "";
          }
        },
        type: Symbol
      });
    };
  }
}

export const ELabel = Object.freeze({
  HEADING_ONE: Symbol("h1"),
  HEADING_TWO: Symbol("h2"),
  HEADING_THREE: Symbol("h3"),
  HEADING_FOUR: Symbol("h4"),
  HEADING_FIVE: Symbol("h5"),
  HEADING_SIX: Symbol("h6"),

  NONE: Symbol("none"),
  TAG: Symbol("tag"),
  BADGE: Symbol("badge")
});