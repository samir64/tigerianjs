import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  BLabel
} from "../behaviors/BLabel.js";

/**
 * Created by samir on 8/26/16.
 */

"use strict";

/**
 * @extends {Control}
 * @implements {BText}
 * @implements {BLabel}
 * @constructor
 */
export class HyperLink extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text
   * @param {string} url
   * @param {string} [theme = ""]
   */
  constructor(parent, text, url, theme = "") {
    super(parent, theme);

    //NOTE Private Variables
    let elmHyperLink = document.createElement("a");
    let that = this;

    this.config(BText, elmHyperLink, text);
    this.config(BLabel);

    //NOTE Attributes
    // this.setAttribute("element-type", "Link");
    this.dataset.elementName = "container";

    // elmHyperLink.setAttribute("element-type", "Link");
    // elmHyperLink.setAttribute("element-name", "text");

    this.dataset.labelType = "";

    // if (instanceOf(text, String)) {
    //     elmHyperLink.innerHTML = text;
    // }
    if (instanceOf(url, String)) {
      elmHyperLink.href = url;
    }

    //NOTE Append Children
    this.addControl(elmHyperLink);

    //NOTE Public Properties
    /**
     * @member {string}
     */
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      get() {
        return elmHyperLink.href;
      },

      set(v) {
        elmHyperLink.href = v;
      }
    });

    delete this.addControl;

    elmHyperLink.addEventListener(
      "click",
      (e) => {
        if (!(that.enabled && that.visible)) {
          e.preventDefault();
        }
      },
      true
    );
  }
}