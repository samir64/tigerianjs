import {
  Control
} from "../core/Control.js";

/**
 * Created by samir on 8/26/16.
 */

("use strict");

/**
 * @property {string} text
 * @property {source} Control
 * @property {boolean} visible
 *
 * @extends {Control}
 * @constructor
 */
export class Continer extends Control {
  /**
   * @param {UI} parent
   * @param {string} theme = ""
   */
  constructor(parent, theme = "") {
    super(parent, theme);

    //NOTE Private Variables
    // var elmBody = document.createElement("div");
    // var thisAddControl = this.addControl;

    //NOTE Attributes
    this.setAttribute("element-type", "Container");
    this.setAttribute("element-name", "container");

    // elmBody.setAttribute("element-type", "Container");
    // elmBody.setAttribute("element-name", "body");

    //NOTE Append Children
    /* thisAddControl(elmBody);

    this.addControl = function(control) {
      if (instanceOf(control, Element)) {
        elmBody.appendChild(control);
      } else if (instanceOf(control, Control)) {
        control.appendTo(this, elmBody);
      }
    }; */
  }
}