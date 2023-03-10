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
  Spacer
} from "./Spacer.js";
import {
  BText
} from "../behaviors/BText.js";

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 */
export class Menu extends Control {
  /**
   * @constructs
   * @param {UI} parent

   */
  constructor(parent) {
    super(parent, "ul");
    this.config(BGroup, this);

    let superAddControl = this.addControl.bind(this);

    // this.setAttribute("element-type", "Menu");
    this.dataset.elementName = "container";

    /**
     * @param {Control} item
     */
    this.addControl = (item) => {
      superAddControl(item);
    };
  }
}