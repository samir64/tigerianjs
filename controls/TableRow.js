import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 */
export class TableRow extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {number} colCount = 1
   * @param {string} theme = ""
   */
  constructor(parent, colCount = 1, theme = "") {
    super(parent, theme);
    this.config(BGroup);

    var superAddControl = this.addControl.bind(this);
    var superGetItem = this.getItem.bind(this);

    this.setAttribute("element-type", "TableRow");
    this.setAttribute("element-name", "container");

    if (instanceOf(colCount, "number")) {
      colCount = Math.max(1, colCount);
    } else {
      colCount = 1;
    }

    /**
     * @member {number}
     */
    this.defineProperty("colCount", {
      get() {
        return colCount;
      }
    });

    for (var i = 0; i < colCount; i++) {
      var newCell = new TableCell(this, "", this.theme);
      newCell.setAttribute("column-number", i.toString());
      newCell.setAttribute("hover", false);
      // newCell.normalColumn = ((colCount <= 12) ? Math.floor(12 / colCount) : 1);
    }

    this.getCell = this.getItem;

    delete this.removeItem;
    delete this.addControl;
    delete this.addItem;
  }
}