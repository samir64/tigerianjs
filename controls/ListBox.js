import { instanceOf } from "../core/Tigerian.js";

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
ListBox = Control.extend(
  {
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function(parent, theme) {
      this.super(parent, theme);
      this.config("group");
      this.config("select_group");

      //NOTE Private Variables
      var instance = this;

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
      this.addControl = this.addItem = function(item) {
        if (instanceOf(item, String)) {
          item = new ListItem(null, item, this.theme);
        } else if (!(instanceOf(item, Control) && item["Behavior:select"])) {
          item = new ListItem(
            null,
            "Item " + (this.itemCount + 1).toString(),
            this.theme
          );
        }

        item.autoDeselect = this.multiSelect;
        superAddControl(item);
      };

      /**
       * @param {boolean} accending = true
       */
      this.sort = function(ascending) {
        /**
         * @param {ListItem} a
         * @param {ListItem} b
         */
        function sort(a, b) {
          return ascending === false
            ? b.text.padNumbers(20, 20) >= a.text.padNumbers(20, 20)
            : a.text.padNumbers(20, 20) >= b.text.padNumbers(20, 20);
        }

        bGroupSort(sort);
      };
    }
  },
  BGroup,
  BSelectGroup
);
