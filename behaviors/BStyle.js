import {
  Behavior
} from "../core/Behavior.js";
import {
  forEach,
} from "../core/Tigerian.js";
import {
  responsive
} from "../core/Responsive.js";

("use strict");

/* let allStylesList = [];

forEach(document.body.style, (prop, propName) => {
  allStylesList.push(propName);
});

allStylesList = allStylesList.filter((item) => {
  return ((parseInt(item) != item)) && (item[0] < "A" || item[0] > "Z") && !allStylesList.some((it) => {
    return (it !== item) && (it.replace(/-/g, "") === item.toLowerCase());
  });
});
console.log(allStylesList); */

/**
 * @constructor
 * @extends {Behavior}
 */
export class BStyle extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     * @param {Element, DocumentFragment} mainElement 
     */
    this.config = (that, mainElement) => {
      let specificClass = `control-${Math.round(Date.now() * Math.random())}`;
      const styles = {};
      let sizes = [...responsive.sizes, EStyle.INLINE];

      mainElement.id = specificClass;

      forEach(sizes, sizeName => {
        const size = responsive.size(sizeName);
        const styleSheet = size.query;
        const strName = sizeName.toString().match(/\w+\((\w+)\)/)[1];
        let rule;

        switch (sizeName) {
          case EStyle.INLINE:
            Object.defineProperty(styles, sizeName, {
              enumerable: true,
              configurable: true,
              get() {
                return mainElement.style;
              }
            })
            break;

          default:
            rule = styleSheet.cssRules[styleSheet.insertRule(`#${specificClass}[element-type][element-origin="Container"]{}`, styleSheet.cssRules.length)];

            Object.defineProperty(styles, sizeName, {
              enumerable: true,
              configurable: true,
              get() {
                return rule.style;
              }
            });
            break;
        }
      });

      Object.defineProperty(that, "style", {
        enumerable: true,
        configurable: true,
        get() {
          return styles;
        }
      });
    };
  }
}

export const EStyle = Object.freeze({
  INLINE: Symbol("inline"),
  // INHERIT: Symbol("inherit"),
  // INITIAL: Symbol("initial"),
  // UNSET: Symbol("unset")
});