import { Behavior } from "../core/Behavior.js";

("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
export class BTable extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.defineMethod("config", (that, ctrlTableBody, colCount = 1) => {
      let columnsVisiblity = [];
      let rowCount = 0;
      let ctrlHeadRow = new TableRow(ctrlTableBody, colCount, that.theme);

      for (let i = 0; i < colCount; i++) {
        columnsVisiblity.push(true);
      }

      that.setAttribute("view-mode", "grid");

      let refreshView = function () {
        if (ctrlTableBody.itemCount <= rowCount) {
          for (let i = ctrlTableBody.itemCount; i <= rowCount; i++) {
            addRow();
          }
        } else {
          rowCount = ctrlTableBody.itemCount - 1;
        }

        for (let i = 0; i <= rowCount; i++) {
          for (let c = 0; c < colCount; c++) {
            if (i === 0) {
              that.getHeadCell(c).visible = columnsVisiblity[c];
            } else {
              that.getCell(i - 1, c).visible = columnsVisiblity[c];
              switch (that.viewMode) {
                case ETable.ListView:
                  that.getCell(i - 1, c).headText = "";
                  that.getHeadCell(c).unbind("text", that.getCell(i - 1, c), "headText");
                  break;

                case ETable.DetailsView:
                  if (that.getHeadCell(c).text) {
                    that.getCell(i - 1, c).headText = that.getHeadCell(c).text + ": ";
                  }
                  that.getHeadCell(c).bind("text", that.getCell(i - 1, c), "headText", function (value) {
                    if ((value === "") || (value === undefined)) {
                      return "";
                    } else {
                      return `${value}: `;
                    }
                  });
                  break;

                default:
              }
            }
          }
        }
      };

      let addRow = function () {
        let newRow = new TableRow(null, colCount, that.theme);

        newRow.setAttribute("hover", "false");

        for (let i = 0; i < colCount; i++) {
          newRow.getCell(i).addEvent("mouseover", onMouseOver);
          newRow.getCell(i).addEvent("mouseleave", onMouseLeave);
        }

        superAddItem(newRow);
      };

      let onMouseOver = function (e) {
        that.parent.setAttribute("hover", "true");
        for (let r = 0; r < rowCount; r++) {
          for (let c = 0; c < colCount; c++) {
            let cell = that.getCell(r, c);
            cell.setAttribute("hover", ((parseInt(that.getAttribute("column-number")) === c) ? "true" : "false"));
            // cell.setAttribute("hover", (((that.parent === cell.parent) || (parseInt(that.getAttribute("column-number")) === c)) ? "true" : "false"));
          }
        }
      };

      let onMouseLeave = function (e) {
        that.parent.setAttribute("hover", "false");
        for (let r = 0; r < rowCount; r++) {
          for (let c = 0; c < colCount; c++) {
            let cell = that.getCell(r, c);
            cell.setAttribute("hover", "false");
          }
        }
      };

      /**
       * @member {number}
       */
      that.defineProperty("rowCount", {
        get() {
          return rowCount;
        },
        set(v) {
          let lastRowCount = rowCount;
          rowCount = v;
          if (lastRowCount !== v) {
            refreshView();
          }
        },
        type: Number
      });

      /**
       * @member {number}
       */
      that.defineProperty("colCount", {
        get() {
          return colCount;
        },
      });

      /**
       * @member {Symbol}
       */
      that.defineProperty("viewMode", {
        get() {
          let v = that.getAttribute("view-mode");
          switch (v) {
            case "grid":
              return ETable.GRID_VIEW;

            case "details":
              return ETable.DETAILS_VIEW;

            default:
              return undefined;
          }
        },
        set(v) {
          let lastViewMode = that.viewMode;
          switch (v) {
            case ETable.GRID_VIEW:
              that.setAttribute("view-mode", "grid");
              break;

            case ETable.DETAILS_VIEW:
              that.setAttribute("view-mode", "details");
              break;

            default:
          }

          if (lastViewMode !== that.viewMode) {
            refreshView();
            that.dispatchEvent(Events.onViewChange);
          }
        },
        type: Symbol
      });

      /**
       * @param {number} col 
       * @param {boolean} visible 
       */
      that.defineMethod("columnVisible", (col, visible) => {
        columnsVisiblity[col] = visible;
        that.getHeadCell(col).visible = visible;
        for (let i = 0; i < rowCount; i++) {
          that.getCell(i, col).visible = visible;
        }
      }, [Number, Boolean]);

      that.addRow = function () {
        addRow();
        that.rowCount++;
      };

      /**
       * @param {number} row
       * @param {number} col
       * @returns {TableCell}
       */
      that.defineMethod("getItem", (row, col) => {
        return superGetItem(row + 1).getItem(col);
      }, [Number, Number]);

      /**
       * @param {number} col
       * @returns {TableCell}
       */
      that.defineMethod("getHeadCell", (col) => {
        return ctrlHeadRow.getItem(col);
      }, [Number]);

      that.defineMethod("clear", () => {
        rowCount = 0;
        ctrlTableBody.clear();
        ctrlTableBody.addControl(ctrlHeadRow);
      });
    }, [Object, Control, Number]);
  }
}

export const ETable = Object.freeze({
  UNLIMIT: Symbol("unlimit"),
  GRID_VIEW: Symbol("grid_view"),
  DETAILS_VIEW: Symbol("details_view")
});