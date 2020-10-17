import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";

/**
 * Created by samir on 8/26/16.
 */

"use strict";

/**
 * @extends {Control}
 * @implements {BText}
 * @constructor
 */
export class Button extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {String} text = ""
   */
  constructor(parent, text = "") {
    //NOTE Private Variables
    let elmButton = document.createElement("div");

    super(parent);
    this.config(BText, elmButton, text);

    let that = this;

    //NOTE Attributes
    // this.setAttribute("element-type", "Button");
    this.attribute("elementName", String, "container");
    elmButton.dataset.elementType = "Button";

    // elmButton.setAttribute("element-type", "Button");
    // elmButton.dataset.elementName = "text";

    // this.setAttribute("fit-content", "false");

    //NOTE Append Children
    this.addControl(elmButton);
    this.hoverable = true;

    //NOTE Properties
    /**
     * @member {number}
     */
    Object.defineProperty(this, "tabIndex", {
      enumerable: true,
      configurable: true,
      get() {
        return elmButton.hasAttribute("tabindex") ?
          elmButton.dataset.tabindex :
          0;
      },
      set(v) {
        if (v > 0) {
          elmButton.dataset.tabindex = v;
        } else {
          elmButton.removeAttribute("tabindex");
        }
      }
    });

    this.select = () => {
      elmButton.focus();
    };

    window.addEventListener(
      "keypress",
      e => {
        if (
          that.default &&
          !e.ctrlKey &&
          !e.altKey &&
          !e.shiftKey &&
          e.code === "Enter" &&
          document.activeElement.dataset.elementType !== "Button"
        ) {
          elmButton.click(that);
        }
      },
      true
    );

    this.addEvent(
      "keypress",
      e => {
        if (
          !e.ctrlKey &&
          !e.altKey &&
          !e.shiftKey &&
          (e.code === "Enter" || e.code === "Space")
        ) {
          elmButton.click(that);
        }
      },
      true
    );

    delete this.addControl;
  }
}