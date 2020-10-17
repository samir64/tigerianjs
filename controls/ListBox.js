import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BGroup
} from "../behaviors/BGroup.js";
import {
  BSelectGroup
} from "../behaviors/BSelectGroup.js";
import {
  BSelect
} from "../behaviors/BSelect.js";

/**
 * Created by samir on 11/10/16.
 */

"use strict";

/**
 * @extends {Control}
 * @implements {BGroup}
 * @implements {BSelectGroup}
 * @constructor
 */
export class ListBox extends Control {
  /**
   * @constructs
   * @param {UI} parent

   */
  constructor(parent) {
    super(parent);
    this.config(BGroup);
    this.config(BSelectGroup);

    //NOTE Private Variables
    let that = this;

    //NOTE Alias Super Members
    let superAddControl = this.addControl.bind(this);
    let bGroupSort = this.sort.bind(this);

    //NOTE Attributes
    // this.setAttribute("element-type", "ListBox");
    this.dataset.elementName = "container";

    //NOTE Public Functions
    /**
     * @param {ListItem|string} item
     */
    this.addControl = (item) => {
      if (instanceOf(item, String)) {
        item = new ListItem(null, item, that.theme);
      } else if (!(instanceOf(item, Control) && instanceOf(item, BSelect))) {
        item = new ListItem(
          null,
          "Item " + (that.itemCount + 1).toString(),
          that.theme
        );
      }

      item.autoDeselect = that.multiSelect;
      superAddControl(item);
    };

    /**
     * @param {boolean} accending = true
     */
    this.sort = (ascending) => {
      /**
       * @param {ListItem} a
       * @param {ListItem} b
       */
      function sort(a, b) {
        return ascending === false ?
          b.text.padNumbers(20, 20) >= a.text.padNumbers(20, 20) :
          a.text.padNumbers(20, 20) >= b.text.padNumbers(20, 20);
      }

      bGroupSort(sort);
    };
  }
}