import {
  Control,
  EControl
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";

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

   */
  constructor(parent, text = "") {
    let elmText = document.createElement("div");
    super(parent);
    this.config(BText, elmText, text);

    let superAddControl = this.addControl;

    this.addControl(elmText);

    // this.setAttribute("element-type", "TableCell");
    this.dataset.elementName = "container";

    // elmText.setAttribute("element-type", "TableCell");
    // elmText.setAttribute("element-name", "text");

    this.situation = EControl.TRANSPARENT;
  }
}