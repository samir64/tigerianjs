import {
  Behavior
} from "../core/Behavior.js";
import {
  EWindow
} from "./BWindow.js";
import {
  forEach,
  instanceOf
} from "../core/Tigerian.js";
import {
  responsiveSizes
} from "../core/Responsive.js";

export class BGridBlock extends Behavior {
  constructor() {
    super();

    this.defineMethod("config", (that) => {
      var elm = document.createElement("style");
      var patterns = {};
      var colCount = {};
      var addedAreas = [];

      document.head.appendChild(elm);
      elm.innerHTML = "";

      forEach(responsiveSizes, (size, sizeName) => {
        patterns[size.name] = ((sizeName === "medium") ? [] : EWindow.MEDIUM);
        colCount[size.name] = ((sizeName === "medium") ? 0 : EWindow.MEDIUM);
      });

      that.defineMethod("addBlockRow", (pattern, size = EWindow.MEDIUM) => {
        if (instanceOf(pattern, Symbol)) {
          patterns[size] = pattern;
          colCount[size] = pattern;
        } else {
          var cnt;
          var re = /(?:\w+|\.)(?::(\d+))?/g;
          var rowColCount = 0;
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
      }, [
        [String, Symbol], Symbol
      ]);

      that.defineMethod("regenerate", (size = EWindow.MEDIUM) => {
        var blocks = patterns[size];
        var col = colCount[size];
        var i = 0;

        while (instanceOf(blocks, Symbol) && (++i < 5)) {
          blocks = patterns[blocks];
        };
        i = 0;
        while (instanceOf(col, Symbol) && (++i < 5)) {
          col = colCount[col];
        };

        return "\n\t\t'" + blocks.map((r) => {
          var result = r.pattern;

          if (r.rowColCount < col) {
            result += ` .:${col - r.rowColCount}`;
          }

          return result;
        }).join("'\n\t\t'").replace(/([\w-\.]+):(\d+)(\s*)/g, (...p) => {
          return (p[1] + " ").repeat(p[2] - 1) + p[1] + p[3];
        }).trim() + "'";
      }, [Symbol]);

      that.defineMethod("getColCount", (size = EWindow.MEDIUM) => {
        var col = colCount[size];
        var i = 0;

        while (instanceOf(col, Symbol) && (++i < 5)) {
          col = colCount[col];
        };

        return col;
      }, [Symbol]);
    });
  }
}