import {
    instanceOf
} from "../core/Tigerian.js";
import { Control } from "../core/Control.js";
import { BGroup } from "../behaviors/BGroup.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 */
export class MainMenu extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} theme = ""
   */
  constructor(parent, theme = "") {
    super(parent, theme);
    this.config(BGroup);

    var superAddControl = this.addControl.bind(this);
    var superAddItem = this.addItem.bind(this);

    this.setAttribute("element-type", "MainMenu");
    this.setAttribute("element-name", "container");

    /**
     * @param {Tigeriam.MenuItem} item
     */
    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, MenuItem)) {
        superAddItem(item);
      }
    });
  }
}