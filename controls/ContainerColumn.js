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
  ContainerRow
} from "./ContainerRow.js";

export class ContainerColumn extends Control {
  constructor(parent, column) {
    super(parent);

    this.elementName = "container";

    /**
     * 
     * @param {Symbol} symbol 
     */
    const defineColumnController = symbol => {
      let name = symbol.toString().match(/symbol\((\w+)\)/i)[1];
      Object.defineProperty(this, `${name}Column`, {
        enumerable: true,
        configurable: true,
        get() {
          if (this.style[symbol].getPropertyValue("--column")) {
            return parseInt(this.style[symbol].getPropertyValue("--column"));
          } else {
            return false;
          }
        },
        set(v) {
          if ((instanceOf(v, Number)) && (v > 0)) {
            this.style[symbol].setProperty("--column", v);
          } else if (((v === 0) || (v === false)) && (symbol !== EResponsive.XSMALL)) {
            this.style[symbol].removeProperty("--column");
          } else {
            throw new Error("Value is not valid");
          }
        },
      });
    };

    responsive.sizes.forEach(size => {
      defineColumnController(size);
    });
    //NOTE Attributes
    // this.attribute("xsmallColumn", Number, column, (method, value) => {
    //   if (method === EMethod.SET) {
    //     this.style[EResponsive.XSMALL].setProperty("--column", value);
    //   }

    //   return value;
    // });
    // this.attribute("smallColumn", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.SMALL].setProperty("--column", value);
    //     } else {
    //       this.style[EResponsive.SMALL].removeProperty("--column");
    //     }
    //   }

    //   return value;
    // });
    // this.attribute("mediumColumn", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.MEDIUM].setProperty("--column", value);
    //     } else {
    //       this.style[EResponsive.MEDIUM].removeProperty("--column");
    //     }
    //   }

    //   return value;
    // });
    // this.attribute("largeColumn", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.LARGE].setProperty("--column", value);
    //     } else {
    //       this.style[EResponsive.LARGE].removeProperty("--column");
    //     }
    //   }

    //   return value;
    // });
    // this.attribute("xlargeColumn", Number, 0, (method, value) => {
    //   if (method === EMethod.SET) {
    //     if (value > 0) {
    //       this.style[EResponsive.XLARGE].setProperty("--column", value);
    //     } else {
    //       this.style[EResponsive.XLARGE].removeProperty("--column");
    //     }
    //   }

    //   return value;
    // });

    this.addRow = (colCount = 12) => new ContainerRow(this, colCount);

    this.style[EResponsive.XSMALL].setProperty("--column", column);

    responsive.addEvent(Events.onMediaQueryAdd, e => {
      defineColumnController(e.data);
    });

    responsive.addEvent(Events.onMediaQueryRemove, e => {
      let name = e.data.toString().match(/symbol\((\w+)\)/i)[1];
      delete this[`${name}Column`];
    });
  }
}