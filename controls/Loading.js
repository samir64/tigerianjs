import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BFixElement,
  EFixElement
} from "../behaviors/BFixElement.js";
import {
  BModal
} from "../behaviors/BModal.js";

"use strict";

/**
 * @constructor
 * @extends {Control}
 * @implements {BFixElement}
 * @implements {BModal}
 */
export class Loading extends Control {
  /**
   * @param {UI} parent

   */
  constructor(parent) {
    super(parent);
    this.config(BFixElement, EFixElement.TOP);
    this.config(BModal, parent);

    let elmBar = document.createElement("div");
    let loaded = 0;
    let that = this;

    // this.setAttribute("element-type", "Loading");
    this.dataset.elementName = "container";
    this.dataset.situation = "opposite";

    // elmBar.setAttribute("element-type", "Loading");
    elmBar.dataset.elementName = "bar";
    elmBar.dataset.situation = "error";

    this.dataset.state = "indeterminate";

    this.addControl(elmBar);

    this.status = BModal.EClose;
    this.fixed = true;

    /**
     * @member {number}
     */
    Object.defineProperty(this, "loaded", {
      enumerable: true,
      configurable: true,
      get() {
        return loaded;
      },
      set(v) {
        if (instanceOf(v, "number")) {
          v = Math.max(0, Math.min(100, v));
          loaded = v;
          if (that.state === Loading.EDeterminate) {
            elmBar.style.width = `${v}%`;
          } else {
            elmBar.style.width = "";
          }
        }
      }
    });

    /**
     * @member {symbol}
     */
    Object.defineProperty(this, "state", {
      enumerable: true,
      configurable: true,
      get() {
        let v = elmBar.dataset.state;
        switch (v) {
          case "determinate":
            return Loading.EDeterminate;

          case "indeterminate":
          default:
            return Loading.EIndeterminate;
        }
      },
      set(v) {
        switch (v) {
          case Loading.EDeterminate:
            that.dataset.state = "determinate";
            elmBar.style.width = `${loaded}%`;
            break;

          case Loading.EIndeterminate:
            that.dataset.state = "indeterminate";
            elmBar.style.width = "";
            break;

          default:
        }
      }
    });

    /**
     * @member {symbol}
     */
    Object.defineProperty(this, "barSituation", {
      enumerable: true,
      configurable: true,
      get() {
        let v = elmBar.dataset.situation;

        switch (v) {
          case "title":
            return EControl.TITLE;

          case "default":
            return EControl.DEFAULT;

          case "transparent":
            return EControl.TRANSPARENT;

          case "opposite":
            return EControl.OPPOSITE;

          case "warning":
            return EControl.WARNING;

          case "error":
            return EControl.error;

          case "ok":
            return EControl.OK;

          default:
            return EControl.NONE;
        }
      },
      set(v) {
        switch (v) {
          case EControl.TITLE:
            elmBar.dataset.situation = "title";
            break;

          case EControl.DEFAULT:
            elmBar.dataset.situation = "default";
            break;

          case EControl.TRANSPARENT:
            elmBar.dataset.situation = "transparent";
            break;

          case EControl.OPPOSITE:
            elmBar.dataset.situation = "opposite";
            break;

          case EControl.WARNING:
            elmBar.dataset.situation = "warning";
            break;

          case EControl.ERROR:
            elmBar.dataset.situation = "error";
            break;

          case EControl.OK:
            elmBar.dataset.situation = "ok";
            break;

          case EControl.NONE:
          default:
            elmBar.dataset.situation = "";
            break;
        }
      }
    });

    delete this.addControl;
  }
}

export const ELoading = Object.freeze({
  INDETERMINATE: Symbol("indeterminate"),
  DETERMINATE: Symbol("determinate")
});