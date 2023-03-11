import {
  Control
} from "../core/Control.js";
import {
  Events
} from "../core/Events.js";
import {
  EResponsive,
  responsive
} from "../core/Responsive.js";
// import {
//   instanceOf
// } from "../core/Tigerian.js";
import {
  EMethod
} from "../core/UI.js";
import {
  ContainerColumn
} from "./ContainerColumn.js";

/**
 * @class
 * @extends Control
 */
export class ContainerRow extends Control {
  /**
   * @constructor
   * @param {UI} parent
   * @param {Number} columnCount
   */
  constructor(parent, columnCount = 12) {
    super(parent);
    this.elementName = "container";

    /**
     * 
     * @param {Symbol} symbol 
     */
    const defineColumnController = symbol => {
      let name = symbol.toString().match(/symbol\((\w+)\)/i)[1];
      Object.defineProperty(this, `${name}ColumnCount`, {
        enumerable: true,
        configurable: true,
        get() {
          if (this.style[symbol].hasProperty("--column-count")) {
            return parseInt(this.style[symbol].getPropertyValue("--column-count"));
          } else {
            return false;
          }
        },
        set(v) {
          if ((instanceOf(v, Number)) && (v > 0)) {
            this.style[symbol].setProperty("--column-count", v);
          } else if (((v === 0) || (v === false)) && (symbol !== EResponsive.XSMALL)) {
            this.style[symbol].removeProperty("--column-count");
          } else {
            throw new Error("Value is not valid");
          }
        },
      })
    }

    responsive.sizes.forEach(size => {
      defineColumnController(size);
    });
    // this.attribute("xsmallColumnCount", Number, columnCount, (method, value) => {
    //   if (method === EMethod.SET) {
    //     this.style[EResponsive.XSMALL].setProperty("--column-count", value);
    //   }

    //   return value;
    // });
    // this.attribute("smallColumnCount", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.SMALL].setProperty("--column-count", value);
    //     } else {
    //       this.style[EResponsive.SMALL].removeProperty("--column-count");
    //     }
    //   }

    //   return value;
    // });
    // this.attribute("mediumColumnCount", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.MEDIUM].setProperty("--column-count", value);
    //     } else {
    //       this.style[EResponsive.MEDIUM].removeProperty("--column-count");
    //     }
    //   }

    //   return value;
    // });
    // this.attribute("largeColumnCount", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.LARGE].setProperty("--column-count", value);
    //     } else {
    //       this.style[EResponsive.LARGE].removeProperty("--column-count");
    //     }
    //   }

    //   return value;
    // });
    // this.attribute("xlargeColumnCount", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.XLARGE].setProperty("--column-count", value);
    //     } else {
    //       this.style[EResponsive.XLARGE].removeProperty("--column-count");
    //     }
    //   }

    //   return value;
    // });

    /**
     * 
     * @param {Number} column Default: columnCount
     */
    this.addColumn = (column = columnCount) => new ContainerColumn(this, column);

    this.style[EResponsive.XSMALL].setProperty("--column-count", columnCount);

    responsive.addEvent(Events.onMediaQueryAdd, e => {
      defineColumnController(e.data);
    });

    responsive.addEvent(Events.onMediaQueryRemove, e => {
      let name = e.data.toString().match(/symbol\((\w+)\)/i)[1];
      delete this[`${name}ColumnCount`];
    });
  }
}