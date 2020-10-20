import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";

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

   */
  constructor(parent, colCount = 1) {
    super(parent);
    this.config(BGroup);

    let superAddControl = this.addControl.bind(this);
    let superGetItem = this.getItem.bind(this);

    // this.setAttribute("element-type", "TableRow");
    this.dataset.elementName = "container";

    if (instanceOf(colCount, "number")) {
      colCount = Math.max(1, colCount);
    } else {
      colCount = 1;
    }

    /**
     * @member {number}
     */
    Object.defineProperty(this, "colCount", {
      enumerable: true,
      configurable: true,
      get() {
        return colCount;
      }
    });

    for (let i = 0; i < colCount; i++) {
      let newCell = new TableCell(this, "", this.theme);
      newCell.dataset.columnNumber = i;
      newCell.dataset.hover = false;
      // newCell.normalColumn = ((colCount <= 12) ? Math.floor(12 / colCount) : 1);
    }

    this.getCell = this.getItem;

    delete this.removeItem;
    delete this.addControl;
    delete this.addItem;
  }
}