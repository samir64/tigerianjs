import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";

/**
 * Created by samir on 8/26/16.
 */

("use strict");

/**
 * @extends {Control}
 * @implements {BText}
 * @constructor
 */
export class Button extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text = ""
   * @param {string} theme = ""
   */
  constructor(parent, text = "", theme = "") {
    //NOTE Private Variables
    var elmButton = document.createElement("div");

    super(parent, theme);
    this.config(BText, elmButton);

    var that = this;

    //NOTE Attributes
    this.setAttribute("element-type", "Button");
    this.setAttribute("element-name", "container");

    elmButton.setAttribute("element-type", "Button");
    // elmButton.setAttribute("element-name", "text");

    this.setAttribute("fit-content", "false");

    if (instanceOf(text, String)) {
      elmButton.innerHTML = text;
    }

    //NOTE Append Children
    this.addControl(elmButton);
    this.hoverable = true;

    //NOTE Properties
    /**
     * @member {number}
     */
    this.defineProperty("tabIndex", {
      get() {
        return elmButton.hasAttribute("tabindex") ?
          elmButton.getAttribute("tabindex") :
          0;
      },
      set(v) {
        if (v > 0) {
          elmButton.setAttribute("tabindex", v);
        } else {
          elmButton.removeAttribute("tabindex");
        }
      },
      type: Number
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("fitContent", {
      get() {
        return this.getAttribute("fit-content");
      },
      set(v) {
        this.setAttribute("fit-content", v ? "true" : "false");
      },
      type: Boolean
    });

    this.defineMethod("select", () => {
      elmButton.focus();
    });

    window.addEventListener(
      "keypress",
      (e) => {
        if (
          that.default &&
          !e.ctrlKey &&
          !e.altKey &&
          !e.shiftKey &&
          e.code === "Enter" &&
          document.activeElement.getAttribute("element-type") !== "Button"
        ) {
          elmButton.click(that);
        }
      },
      true
    );

    this.addEvent(
      "keypress",
      (e) => {
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