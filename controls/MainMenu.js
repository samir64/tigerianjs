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

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 */
export class MainMenu extends Control {
  /**
   * @constructs
   * @param {UI} parent

   */
  constructor(parent) {
    super(parent, "nav");
    this.config(BGroup, this);

    let ctrlItemsList = new Control(this, "ul");

    let superAddControl = this.addControl.bind(this);

    // this.setAttribute("element-type", "MainMenu");
    this.dataset.elementName = "container";

    // ctrlItemsList.setAttribute("element-type", "MainMenu");
    ctrlItemsList.dataset.elementName = "items";

    /**
     * @param {MenuItem} item
     */
    this.addControl = (item) => {
      if (instanceOf(item, MenuItem)) {
        // superAddControl(item);
        ctrlItemsList.addControl(item);
      }
    };
  }
}