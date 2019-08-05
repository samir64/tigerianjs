import {
  instanceOf
} from "../core/Tigerian.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 */
export class Menu extends Control {
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

    this.setAttribute("element-type", "Menu");
    this.setAttribute("element-name", "container");

    /**
     * @param {Tigeriam.MenuItem} item
     */
    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, MenuItem) || instanceOf(item, Spacer)) {
        superAddItem(item);
      }
    });
  }
}