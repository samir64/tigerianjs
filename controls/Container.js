import {
  Control
} from "../core/Control.js";
import {
  ContainerRow
} from "./ContainerRow.js";

/**
 * Created by samir on 8/26/16.
 */

/**
 * @property {string} text
 * @property {source} Control
 * @property {boolean} visible
 *
 * @extends {Control}
 * @constructor
 */
export class Container extends Control {
  /**
   * @param {UI} parent

   */
  constructor(parent) {
    super(parent);

    //NOTE Private Variables
    // let elmBody = document.createElement("div");
    // let thisAddControl = this.addControl;

    //NOTE Attributes
    // this.setAttribute("element-type", "Container");
    this.elementName = "container";

    this.addRow = columnCount => new ContainerRow(this, columnCount);

    // elmBody.setAttribute("element-type", "Container");
    // elmBody.setAttribute("element-name", "body");

    //NOTE Append Children
    /* thisAddControl(elmBody);

    this.addControl = (control) => {
      if (instanceOf(control, Element)) {
        elmBody.appendChild(control);
      } else if (instanceOf(control, Control)) {
        control.appendTo(this, elmBody);
      }
    }; */
  }
}