import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";

"use strict";

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 * @implements {BTable}
 */
export class TableBody extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} theme = ""
   */
  constructor(parent, theme = "") {
    super(parent, theme);
    this.config(BGroup);

    // this.setAttribute("element-type", "TableBody");
    this.dataset.elementName = "container";
  }
}