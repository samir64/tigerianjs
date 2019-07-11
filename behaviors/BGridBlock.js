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
} from "../style/Responsive.js";

export class BGridBlock extends Behavior {
  constructor() {
    super();

    this.defineMethod("config", (that) => {
      var elm = document.createElement("style");
      var rows = {};

      document.head.appendChild(elm);
      elm.innerHTML = "";

      forEach(responsiveSizes, (size, sizeName) => {
        rows[size.name] = ((sizeName === "medium") ? [] : EWindow.MEDIUM);
      });

      that.defineMethod("addBlockRow", (pattern, size = EWindow.MEDIUM) => {
        if (instanceOf(rows[size], Symbol)) {
          rows[size] = [pattern];
        } else {
          rows[size].push(pattern);
        }

        forEach(pattern.replace(/:\d+/g, "").split(" "), (item) => {
          elm.innerHTML += `  [element-name="container"][template-item="${item}"][visible="true"] {\n    grid-area:\n${item}\n}\n\n`;
        });
      }, [
          [String, Symbol], Symbol
        ]);

      that.defineMethod("regenerate", (size = EWindow.MEDIUM) => {
        var row = rows[size];
        var i = 0;
        while (instanceOf(row, Symbol) && (++i < 5)) {
          row = rows[row];
        };

        return "\t\t\n'" + row.join("'\n'").replace(/([\w-]+):(\d+)(\s*)/g, (...p) => {
          return (p[1] + " ").repeat(p[2] - 1) + p[1] + p[3];
        }).trim() + "';\n";
      }, [Symbol]);
    });
  }
}