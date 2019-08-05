import {
  instanceOf
} from "../core/Tigerian.js";

/**
 * Created by samir on 11/10/16.
 */

("use strict");

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
   * @param {string} theme = ""
   */
  constructor(parent, theme = "") {
    super(parent, theme);
    this.config(Broup);
    this.config(BelectGroup);

    //NOTE Private Variables
    var that = this;

    //NOTE Alias Super Members
    var superAddControl = this.addControl.bind(this);
    var bGroupSort = this.sort.bind(this);

    //NOTE Attributes
    this.setAttribute("element-type", "ListBox");
    this.setAttribute("element-name", "container");

    //NOTE Public Functions
    /**
     * @param {ListItem|string} item
     */
    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, String)) {
        item = new ListItem(null, item, that.theme);
      } else if (!(instanceOf(item, Control) && item["Behavior:select"])) {
        item = new ListItem(
          null,
          "Item " + (that.itemCount + 1).toString(),
          that.theme
        );
      }

      item.autoDeselect = that.multiSelect;
      superAddControl(item);
    });

    /**
     * @param {boolean} accending = true
     */
    this.defineMethod("sort", (ascending) => {
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
    });
  }
}