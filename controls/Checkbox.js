import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  BSelect
} from "../behaviors/BSelect.js";
import {
  Events
} from "../core/Events.js"

/**
 * Created by samir on 8/26/16.
 */

("use strict");

/**
 * @extends {Control}
 * @implements {BSelect}
 * @implements {BText}
 * @constructor
 */
export class Checkbox extends Control {
  /**
   * @constructs
   * @param {string} [text = ""]
   * @param {string} [theme = ""]
   * @param {UI} parent
   */
  constructor(parent, text = "", theme = "") {
    let elmCheckbox = document.createElement("div");
    let elmLabel = document.createElement("div");

    super(parent, theme);
    this.config(BSelect);
    this.config(BText, elmLabel, text);

    //NOTE Alias Super Members
    let superSelected = Object.getOwnPropertyDescriptor(this, "selected");

    //NOTE Private Variables
    let that = this;

    //NOTE Attributes
    this.setAttribute("element-name", "container");
    this.setAttribute("element-type", "Checkbox");

    elmCheckbox.setAttribute("element-name", "check");
    elmCheckbox.setAttribute("element-type", "Checkbox");
    elmCheckbox.setAttribute("element-situation", "");
    this.setAttribute("element-hoverable", "true");

    // elmLabel.setAttribute("element-name", "label");
    elmLabel.setAttribute("element-type", "Checkbox");

    //NOTE Append Children
    this.addControl(elmCheckbox);
    this.addControl(elmLabel);

    this.defineProperty("indeterminate", {
      get() {
        return that.getAttribute("selected") == "indeterminate";
      },
      set(v) {
        let lastValue = that.indeterminate;

        that.setAttribute("selected", v ? "indeterminate" : "false");

        if (v != lastValue) {
          that.dispatchEvent(Events.onIndeterminateChange);
        }
      },
      type: Boolean
    });

    this.defineProperty("selected", {
      get: superSelected.get.bind(this),
      set(v) {
        that.indeterminate = false;
        superSelected.set.bind(this)(v);
      },
      type: Boolean
    });
  }
}