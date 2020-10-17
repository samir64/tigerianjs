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

   */
  constructor(parent) {
    super(parent);
    this.config(BGroup);

    // this.setAttribute("element-type", "TableBody");
    this.dataset.elementName = "container";
  }
}