import {
  forEach,
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";
import {
  CollapseItem
} from "./CollapseItem.js";

"use strict";

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
    super(parent, theme, "ul");
    this.config(BGroup, this);

    // let superAddItem = this.addItem.bind(this);
    let that = this;

    // this.setAttribute("element-type", "CollapseList");
    this.dataset.elementName = "container";

    // this.normalColumn = BWindow.ENone;

    /* this.addControl = this.addItem = (item) => {
      if (instanceOf(item, CollapseItem)) {
        superAddItem(item);
      }
    }; */

    this.collapseAll = () => {
      forEach(that, (item) => {
        if (instanceOf(item, CollapseItem)) {
          item.collapse();
        }
      });
      /* for (let i = 0; i < this.itemCount; i++) {
        this.getItem(i).collapse();
      } */
    };

    this.expandAll = () => {
      forEach(that, (item) => {
        item.expand();
      });
      /* for (let i = 0; i < this.itemCount; i++) {
        this.getItem(i).expand();
      } */
    };
  }
}