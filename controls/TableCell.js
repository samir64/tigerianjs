import { Control, EControl } from "../core/Control.js";
import { BText } from "../behaviors/BText.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 */
export class TableCell extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text = ""
   * @param {string} theme = ""
   */
  constructor(parent, text = "", theme = "") {
    let elmText = document.createElement("div");
    super(parent, theme);
    this.config(BText, elmText, text);

    let superAddControl = this.addControl;

    this.addControl(elmText);

    this.setAttribute("element-type", "TableCell");
    this.setAttribute("element-name", "container");

    elmText.setAttribute("element-type", "TableCell");
    // elmText.setAttribute("element-name", "text");

    this.situation = EControl.TRANSPARENT;
  }
}