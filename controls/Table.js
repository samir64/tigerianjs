import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";
import {
  BTable
} from "../behaviors/BTable.js";

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

   */
  constructor(parent, colCount = 1, caption = "") {
    super(parent);

    // this.setAttribute("element-type", "Table");
    this.dataset.elementName = "container";

    let ctrlTableHeader = new Header(this, false, this.theme);
    let ctrlTableBody = new TableBody(this, this.theme);
    let ctrlCaption = new Label(ctrlTableHeader, "", this.theme);

    this.config(BGroup, ctrlTableBody);
    this.config(BTable, colCount, ctrlTableBody);

    ctrlCaption.text = caption;

    /**
     * @member {string}
     */
    Object.defineProperty(this, "caption", {
      enumerable: true,
      configurable: true,
      get() {
        return ctrlCaption.text;
      },
      set(v) {
        ctrlCaption.text = v;
      }
    });

    /**
     * @member {boolean}
     */
    Object.defineProperty(this, "captionVisible", {
      enumerable: true,
      configurable: true,
      get() {
        return ctrlCaption.visible;
      },
      set(v) {
        ctrlCaption.visible = v;
      }
    });

    this.addControl = this.addItem = this.addRow;
    delete this.removeItem;
    // delete this.clear;
  }
}