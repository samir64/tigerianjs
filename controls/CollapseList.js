import {
  instanceOf,
  forEach
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
export class CollapseList extends Control {
  /**
   * @constructs
   * @param {Control} parent
   * @param {string} theme = ""
   */
  constructor(parent, theme = "") {
    super(parent, theme);
    this.config(BGroup, this);

    // var superAddItem = this.addItem.bind(this);
    var that = this;

    this.setAttribute("element-type", "CollapseList");
    this.setAttribute("element-name", "container");

    // this.normalColumn = BWindow.ENone;

    /* this.addControl = this.addItem = function (item) {
      if (instanceOf(item, CollapseItem)) {
        superAddItem(item);
      }
    }; */

    this.defineMethod("collapseAll", () => {
      forEach(that, (item) => {
        item.collapse();
      });
      /* for (var i = 0; i < this.itemCount; i++) {
        this.getItem(i).collapse();
      } */
    });

    this.defineMethod("expandAll", () => {
      forEach(that, (item) => {
        item.expand();
      });
      /* for (var i = 0; i < this.itemCount; i++) {
        this.getItem(i).expand();
      } */
    });
  }
}