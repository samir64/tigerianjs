import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  BCancel
} from "../behaviors/BCancel.js";

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

   */
  constructor(parent, text) {
    let elmMessage = document.createElement("div");
    let elmDesc = document.createElement("div");

    super(parent);
    this.config(BText, elmMessage, text);
    this.config(BCancel, this);

    // this.setAttribute("element-type", "Notification");
    this.dataset.elementName = "container";

    // elmMessage.setAttribute("element-type", "Notification");

    // elmDesc.setAttribute("element-type", "Notification");
    elmDesc.dataset.elementName = "description";

    Object.defineProperty(this, "description", {
      enumerable: true,
      configurable: true,
      get() {
        return elmDesc.innerHTML;
      },
      set(v) {
        elmDesc.innerHTML = v;
      }
    });

    this.addControl(elmMessage);
    this.addControl(elmDesc);
  }
}