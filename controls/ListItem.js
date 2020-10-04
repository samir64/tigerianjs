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
 * Created by samir on 11/7/16.
 */

"use strict";

/**
 * @extends {Label}
 * @implements {BSelect}
 * @implements {BText}
 * @constructor
 */
export class ListItem extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text
   * @param {string} [theme = ""]
   */
  constructor(parent, text, theme = "") {
    let elmItem = document.createElement("div");

    super(parent, theme);
    this.config(BSelect);
    this.config(BText, elmItem, text);

    this.addControl(elmItem);

    // if (instanceOf(text, String)) {
    //     elmItem.innerHTML = text;
    // }

    //NOTE Attributes
    // this.setAttribute("element-type", "ListItem");
    this.dataset.elementName = "container";

    // elmItem.setAttribute("element-type", "ListItem");
    elmItem.dataset.elementName = "item";

    // Object.defineProperty(this, "text", {
    //     enumerable: true,
    //     configurable: true,
    //     get() {
    //         return elmItem.innerHTML;
    //     },
    //     set(v) {
    //         if (instanceOf(v, String)) {
    //             elmItem.innerHTML = v;
    //         }
    //     }
    // });
  }
}