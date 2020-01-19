import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";
import {
  MenuItem
} from "./MenuItem.js";

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
    super(parent, theme, "nav");
    this.config(BGroup, this);

    let ctrlItemsList = new Control(this, theme, "ul");

    let superAddControl = this.addControl.bind(this);

    this.setAttribute("element-type", "MainMenu");
    this.setAttribute("element-name", "container");

    ctrlItemsList.setAttribute("element-type", "MainMenu");
    ctrlItemsList.setAttribute("element-name", "items");

    /**
     * @param {MenuItem} item
     */
    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, MenuItem)) {
        // superAddControl(item);
        ctrlItemsList.addControl(item);
      }
    });
  }
}