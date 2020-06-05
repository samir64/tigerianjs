import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";
import { BTable } from "../behaviors/BTable.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 * @implements {BTable}
 */
export class Table extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {number} colCount = 1
   * @param {string} caption = ""
   * @param {string} theme = ""
   */
  constructor(parent, colCount = 1, caption = "", theme = "") {
    super(parent, theme);

    this.setAttribute("element-type", "Table");
    this.setAttribute("element-name", "container");

    let ctrlTableHeader = new Header(this, false, this.theme);
    let ctrlTableBody = new TableBody(this, this.theme);
    let ctrlCaption = new Label(ctrlTableHeader, "", this.theme);

    this.config(BGroup, ctrlTableBody);
    this.config(BTable, colCount, ctrlTableBody);

    ctrlCaption.text = caption;

    /**
     * @member {string}
     */
    this.defineProperty("caption", {
      get() {
        return ctrlCaption.text;
      },
      set(v) {
        ctrlCaption.text = v;
      },
      type: String
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("captionVisible", {
      get() {
        return ctrlCaption.visible;
      },
      set(v) {
        ctrlCaption.visible = v;
      },
      type: Boolean
    });

    this.addControl = this.addItem = this.addRow;
    delete this.removeItem;
    // delete this.clear;
  }
}