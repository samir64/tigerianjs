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
  constructor(parent, text) {
    let elmRadioButton = document.createElement("div");
    let elmLabel = document.createElement("div");

    super(parent);
    this.config(BSelect);
    this.config(BText, elmLabel, text);


    //NOTE Alias Super Members
    let superSelected = Object.getOwnPropertyDescriptor(this, "selected");


    //NOTE Private Variables
    let that = this;

    //NOTE Attributes
    this.dataset.elementName = "container";
    // this.setAttribute("element-type", "RadioButton");

    elmRadioButton.dataset.elementName = "button";
    // elmRadioButton.setAttribute("element-type", "RadioButton");
    elmRadioButton.dataset.situation = "";
    elmRadioButton.dataset.elementHoverable = "true";

    // elmLabel.dataset.elementName = "label";
    // elmLabel.setAttribute("element-type", "RadioButton");

    //NOTE Append Children
    this.addControl(elmRadioButton);
    this.addControl(elmLabel);

    this.autoDeselect = false;

    /**
     * @member {boolean}
     */
    Object.defineProperty(this, "autoDeselect", {
      enumerable: true,
      configurable: true,
      get() {
        return false;
      },
      set(v) {}
    });
  }
}