import {
  Behavior
} from "../core/Behavior.js";
// import {
//   EWindow
// } from "./BWindow.js";
import {
  forEach,
  instanceOf
} from "../core/Tigerian.js";
import {
  responsive
} from "../core/Responsive.js";

export class BGridBlock extends Behavior {
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     */
    this.config = (that) => {
      let elm = document.createElement("style");
      let patterns = {};
      let colCount = {};
      let addedAreas = [];

      document.head.appendChild(elm);
      elm.innerHTML = "";

      forEach(responsive, (size, sizeName) => {
        patterns[size.name] = ((sizeName === "medium") ? [] : EResponsive.MEDIUM);
        colCount[size.name] = ((sizeName === "medium") ? 0 : EResponsive.MEDIUM);
      });

      /**
       * 
       * @param {String} pattern 
       * @param {Symbol} size 
       */
      that.addBlockRow = (pattern, size = EResponsive.MEDIUM) => {
        if (instanceOf(pattern, Symbol)) {
          patterns[size] = pattern;
          colCount[size] = pattern;
        } else {
          let cnt;
          let re = /(?:\w+|\.)(?::(\d+))?/g;
          let rowColCount = 0;
          while ((cnt = re.exec(pattern)) !== null) {
            rowColCount += ((cnt[1] !== undefined) ? parseInt(cnt[1]) : 1);
          }

          colCount[size] = Math.max(instanceOf(colCount[size], Symbol) ? 0 : colCount[size], rowColCount);
          if (instanceOf(patterns[size], Symbol)) {
            patterns[size] = [];
          }

          patterns[size].push({
            pattern,
            rowColCount
          });

          forEach(pattern.replace(/:\d+/g, "").split(" "), (item) => {
            if ((item !== ".") && (addedAreas.indexOf(item) === -1)) {
              addedAreas.push(item);
              elm.innerHTML += `\t[element-name="container"][template-item="${item}"][visible="true"] {\n\t\tgrid-area: ${item};\n\t}\n\n`;
            }
          });
        }
      };

      /**
       * 
       * @param {Symbol} size 
       */
      that.regenerate = (size = EResponsive.MEDIUM) => {
        let blocks = patterns[size];
        let col = colCount[size];
        let i = 0;

        while (instanceOf(blocks, Symbol) && (++i < 5)) {
          blocks = patterns[blocks];
        };
        i = 0;
        while (instanceOf(col, Symbol) && (++i < 5)) {
          col = colCount[col];
        };

        return "\n\t\t'" + blocks.map((r) => {
          let result = r.pattern;

          if (r.rowColCount < col) {
            result += ` .:${col - r.rowColCount}`;
          }

          return result;
        }).join("'\n\t\t'").replace(/([\w-\.]+):(\d+)(\s*)/g, (...p) => {
          return (p[1] + " ").repeat(p[2] - 1) + p[1] + p[3];
        }).trim() + "'";
      };

      /**
       * 
       * @param {Symbol} size 
       */
      that.getColCount = (size = EResponsive.MEDIUM) => {
        let col = colCount[size];
        let i = 0;

        while (instanceOf(col, Symbol) && (++i < 5)) {
          col = colCount[col];
        };

        return col;
      };
    };
  }
}