import { Behavior } from "../core/Behavior.js";
import { Control } from "../core/Control.js";

("use strict");

export class BLabel extends Behavior {
  constructor() {
    super();

    this.defineMethod("config", (that, ctrlLabel) => {
      var labelType = ELabel.NONE;

      that.setAttribute("label-type", "");

      /**
       * @member {ELabel} labelType
       */
      Object.defineProperty(that, "labelType", {
        enumerable: true,
        configurable: true,
        get: function () {
          return labelType;
        },
        set: function (v) {
          switch (v) {
            case BLabel.ETag:
              labelType = v;
              that.setAttribute("label-type", "tag");
              break;
            case BLabel.EBadge:
              labelType = v;
              that.setAttribute("label-type", "badge");
              break;
            case BLabel.ENone:
            default:
              labelType = v;
              that.setAttribute("label-type", "");
          }
        },
        type: Symbol
      });
    }, [Object, Control]);
  }
}

export const ELabel = Object.freeze({
  NONE: Symbol("none"),
  TAG: Symbol("tag"),
  BADGE: Symbol("badge")
});