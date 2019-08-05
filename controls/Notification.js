import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  BCancel
} from "../behaviors/BCancel.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 * @implements {BCancel}
 */
export class Notification extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text = ""
   * @param {string} theme = ""
   */
  constructor(parent, text, theme = "") {
    var elmMessage = document.createElement("div");

    super(parent, theme);
    this.config(BText, elmMessage, text);
    this.config(BCancel);

    this.setAttribute("element-type", "Notification");
    this.setAttribute("element-name", "container");

    elmMessage.setAttribute("element-type", "Notification");
    // elmMessage.setAttribute("element-name", "message");

    this.addControl(elmMessage);
  }
}