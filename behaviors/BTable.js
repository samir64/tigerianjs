import {
  Behavior
} from "../core/Behavior.js";

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

    /**
     * 
     * @param {Object} that 
     * @param {Control} ctrlTableBody 
     * @param {Number} colCount 
     */
    this.config = (that, ctrlTableBody, colCount = 1) => {
      let columnsVisiblity = [];
      let rowCount = 0;
      let ctrlHeadRow = new TableRow(ctrlTableBody, colCount, that.theme);

      for (let i = 0; i < colCount; i++) {
        columnsVisiblity.push(true);
      }

      that.dataset.viewMode = "grid";

      let refreshView = () => {
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
                  that.getHeadCell(c).bind("text", that.getCell(i - 1, c), "headText", (value) => {
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

      let addRow = () => {
        let newRow = new TableRow(null, colCount, that.theme);

        newRow.dataset.hover = "false";

        for (let i = 0; i < colCount; i++) {
          newRow.getCell(i).addEvent("mouseover", onMouseOver);
          newRow.getCell(i).addEvent("mouseleave", onMouseLeave);
        }

        superAddItem(newRow);
      };

      let onMouseOver = (e) => {
        that.parent.dataset.hover = "true";
        for (let r = 0; r < rowCount; r++) {
          for (let c = 0; c < colCount; c++) {
            let cell = that.getCell(r, c);
            cell.dataset.hover = (parseInt(that.dataset.columnNumber) === c);
            // cell.setAttribute("hover", (((that.parent === cell.parent) || (parseInt(that.getAttribute("column-number")) === c)) ? "true" : "false"));
          }
        }
      };

      let onMouseLeave = (e) => {
        that.parent.dataset.hover = "false";
        for (let r = 0; r < rowCount; r++) {
          for (let c = 0; c < colCount; c++) {
            let cell = that.getCell(r, c);
            cell.dataset.hover = "false";
          }
        }
      };

      /**
       * @member {number}
       */
      Object.defineProperty(that, "rowCount", {
        enumerable: true,
        configurable: true,
        get() {
          return rowCount;
        },
        set(v) {
          let lastRowCount = rowCount;
          rowCount = v;
          if (lastRowCount !== v) {
            refreshView();
          }
        }
      });

      /**
       * @member {number}
       */
      Object.defineProperty(that, "colCount", {
        enumerable: true,
        configurable: true,
        get() {
          return colCount;
        },
      });

      /**
       * @member {Symbol}
       */
      Object.defineProperty(that, "viewMode", {
        enumerable: true,
        configurable: true,
        get() {
          let v = that.dataset.viewMode;
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
              that.dataset.viewMode = "grid";
              break;

            case ETable.DETAILS_VIEW:
              that.dataset.viewMode = "details";
              break;

            default:
          }

          if (lastViewMode !== that.viewMode) {
            refreshView();
            that.dispatchEvent(Events.onViewChange);
          }
        }
      });

      /**
       * @param {Number} col 
       * @param {Boolean} visible 
       */
      that.columnVisible = (col, visible) => {
        columnsVisiblity[col] = visible;
        that.getHeadCell(col).visible = visible;
        for (let i = 0; i < rowCount; i++) {
          that.getCell(i, col).visible = visible;
        }
      };

      that.addRow = () => {
        addRow();
        that.rowCount++;
      };

      /**
       * @param {Number} row
       * @param {Number} col
       * @returns {TableCell}
       */
      that.getItem = (row, col) => {
        return superGetItem(row + 1).getItem(col);
      };

      /**
       * @param {Number} col
       * @returns {TableCell}
       */
      that.getHeadCell = (col) => {
        return ctrlHeadRow.getItem(col);
      };

      that.clear = () => {
        rowCount = 0;
        ctrlTableBody.clear();
        ctrlTableBody.addControl(ctrlHeadRow);
      };
    };
  }
}

export const ETable = Object.freeze({
  UNLIMIT: Symbol("unlimit"),
  GRID_VIEW: Symbol("grid_view"),
  DETAILS_VIEW: Symbol("details_view")
});