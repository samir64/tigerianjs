import {
  Control
} from "../core/Control.js";
import {
  BSelect
} from "../behaviors/BSelect.js";
import {
  BText
} from "../behaviors/BText.js";

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
export class RadioButton extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} [text = ""]
   * @param {string} [theme = ""]
   */
  constructor(parent, text, theme = "") {
    let elmRadioButton = document.createElement("div");
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
    // this.setAttribute("element-type", "RadioButton");

    elmRadioButton.setAttribute("element-name", "button");
    // elmRadioButton.setAttribute("element-type", "RadioButton");
    elmRadioButton.setAttribute("element-situation", "");
    elmRadioButton.setAttribute("element-hoverable", "true");

    // elmLabel.setAttribute("element-name", "label");
    // elmLabel.setAttribute("element-type", "RadioButton");

    //NOTE Append Children
    this.addControl(elmRadioButton);
    this.addControl(elmLabel);

    this.autoDeselect = false;

    /**
     * @member {boolean}
     */
    this.defineProperty("autoDeselect", {
      get() {
        return false;
      },
      set(v) {

      },
      type: Boolean
    });
  }
}