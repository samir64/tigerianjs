import {
  Control
} from "../core/Control.js";

/**
 * Created by samir on 11/11/16.
 */

"use strict";


/**
 * @extends {Control}
 * @constructor
 */
export class Spacer extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {boolean} [hrLine = false]
   * @param {boolean} [vertical = false]
   * @param {string} [theme = ""]
   */
  constructor(parent, hrLine = false, vertical = false, theme = "") {
    super(parent, theme);

    // this.setAttribute("element-type", "Spacer");
    this.dataset.elementName = "container";

    this.dataset.horizontalLine = hrLine;
    this.dataset.vertical = vertical;

    // if (hrLine === true) {
    //     let elmHr = document.createElement("hr");
    //     this.addControl(elmHr);

    //     elmHr.setAttribute("element-type", "Spacer");
    //     elmHr.setAttribute("element-name", "hr");
    // }

    delete this.headText;
    delete this.footText;
    delete this.addControl;
  }
}