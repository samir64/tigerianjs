import { instanceOf } from "../core/Tigerian.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 * @implements {BTable}
 */
Table = Control.extend(
  {
    /**
     * @constructs
     * @param {UI} parent
     * @param {number} colCount = 1
     * @param {string} caption = ""
     * @param {string} theme = ""
     */
    init: function(parent, colCount, caption, theme) {
      this.super(parent, theme);

      this.setAttribute("element-type", "Table");
      this.setAttribute("element-name", "container");

      var ctrlTableHeader = new Header(this, false, this.theme);
      var ctrlTableBody = new TableBody(this, this.theme);
      var ctrlCaption = new Label(ctrlTableHeader, "", this.theme);

      this.config("group", ctrlTableBody);
      this.config("table", colCount, ctrlTableBody);

      ctrlCaption.text = caption;

      /**
       * @member {string}
       */
      Object.defineProperty(this, "caption", {
        enumerable: true,
        configurable: true,
        get: function() {
          return ctrlCaption.text;
        },
        set: function(v) {
          if (instanceOf(v, String)) {
            ctrlCaption.text = v;
          }
        }
      });

      /**
       * @member {boolean}
       */
      Object.defineProperty(this, "captionVisible", {
        enumerable: true,
        configurable: true,
        get: function() {
          return ctrlCaption.visible;
        },
        set: function(v) {
          if (instanceOf(v, "boolean")) {
            ctrlCaption.visible = v;
            inst;
          }
        }
      });

      this.addControl = this.addItem = this.addRow;
      delete this.removeItem;
      // delete this.clear;
    }
  },
  BGroup,
  BTable
);
