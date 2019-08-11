import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";
import { Spacer } from "./Spacer.js";
import { BText } from "../behaviors/BText.js";

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
    super(parent, theme, "ul");
    this.config(BGroup, this);

    var superAddControl = this.addControl.bind(this);

    this.setAttribute("element-type", "Menu");
    this.setAttribute("element-name", "container");

    /**
     * @param {Tigeriam.MenuItem} item
     */
    this.defineMethod("addControl", (item) => {
      superAddControl(item);
    }, [Control]);
  }
}