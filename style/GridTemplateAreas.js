import {
  instanceOf,
  Tigerian,
  forEach
} from "../core/Tigerian.js";
import {
  GridTemplateItem
} from "./GridTemplateItem.js";

/**
 * Created by samir on 8/31/18.
 */

("use strict");

/**
 * @extends {Class}
 * @constructor
 */
export class GridTemplateAreas extends Tigerian {
  /**
   * @constructs
   * @param {Element} element
   * @param {string} name
   * @param {number} colCount
   * @param {number} rowCount
   */
  constructor(element, name, rowCount = 1, colCount = 1) {
    if (instanceOf(element, Text) && instanceOf(name, String)) {
      super();

      colCount = Math.max(1, Math.abs(colCount));

      rowCount = Math.max(1, Math.abs(rowCount));

      var queryText = element.data;
      /**
       * @type {GridTemplateItem[][]}
       */
      var items = [];
      var itemsName = [];

      for (var r = 0; r < rowCount; r++) {
        var row = [];
        for (var c = 0; c < colCount; c++) {
          row.push([]);
        }

        items.push(row);
      }

      var render = function () {
        var areas = `  [element-name="container"][template-name="${name}"][visible="true"] {\n    display: grid;\n    grid-template-areas:\n`;

        forEach(items, (item, rowIdx) => {
          var thisRow = "";
          for (var colIdx = 0; colIdx < item.length; colIdx++) {
            if (thisRow === "") {
              thisRow += "    '";
            } else {
              thisRow += " ";
            }

            for (var i = 0; i < item[colIdx].colSpan; i++) {
              if (i > 0) {
                thisRow += " ";
              }

              thisRow += item[colIdx].name;
            }

            if (item[colIdx].name) {
              colIdx += i - 1;
            }
          }
          thisRow += "'\n";
          areas += thisRow;
        });
        areas += "  }";

        forEach(itemsName, (itemName) => {
          areas += `\n\n  [element-name=\"container\"][template-name=\"${name}\"] > [element-name=\"container\"][template-item=\"${itemName}\"] {\n    grid-area: ${itemName};\n  }`;
        });

        // return areas;
        return areas;
        /* return strFormat(queryText, {
          template: areas
        }); */
      }

      /**
       * @param {string} itemName
       * @param {number} rowNo
       * @param {number} colNo
       * @param {number} rowSpan
       * @param {number} colSpan
       */
      this.defineMethod("addItem", (itemName, rowNo, colNo, rowSpan, colSpan) => {
        if (itemsName.indexOf(itemName) === -1) {
          if (instanceOf(itemName, String) && instanceOf(colNo, "number") && instanceOf(rowNo, "number")) {
            if ((colNo >= 0) && (colNo < colCount) && (rowNo >= 0) && (rowNo < rowCount)) {
              for (var i = 0; i < rowSpan; i++) {
                items[rowNo + i][colNo] = new GridTemplateItem(itemName, colSpan);
              }
            }
          }

          itemsName.push(itemName);
        }

        element.data = render();
      }, [String, Number, Number, Number, Number]);

      /**
       * @member {string}
       */
      this.defineProperty("name", {
        get() {
          return name;
        },
        set(v) {
          name = v;
        },
        type: String
      });

      /**
       * @member {number}
       * @readonly
       */
      this.defineProperty("colCount", {
        get() {
          return colCount;
        },
      });

      /**
       * @member {number}
       * @readonly
       */
      this.defineProperty("rowCount", {
        get() {
          return rowCount;
        },
      });
    }
  }
}