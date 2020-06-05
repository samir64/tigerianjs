import { Control } from "../core/Control.js";
import { BText } from "../behaviors/BText.js";
import { BCancel } from "../behaviors/BCancel.js";

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
    let elmMessage = document.createElement("div");
    let elmDesc = document.createElement("div");

    super(parent, theme);
    this.config(BText, elmMessage, text);
    this.config(BCancel, this);

    this.setAttribute("element-type", "Notification");
    this.setAttribute("element-name", "container");

    elmMessage.setAttribute("element-type", "Notification");
    
    elmDesc.setAttribute("element-type", "Notification");
    elmDesc.setAttribute("element-name", "description");

    this.defineProperty("description", {
      get() {return elmDesc.innerHTML;},
      set(v) {elmDesc.innerHTML = v;},
      type: String
    });

    this.addControl(elmMessage);
    this.addControl(elmDesc);
  }
}
