import {
  Behavior
} from "../core/Behavior.js";
import {
  strSplitCapital,
  forEach,
  Tigerian,
  instanceOf,
  defineProperty,
  defineMethod,
} from "../core/Tigerian.js";
import {
  responsiveSizes,
  mediaQueries
} from "../core/Responsive.js";
import {
  EWindow
} from "./BWindow.js";
import {
  StyleValue
} from "../core/StyleValue.js";

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

    this.defineMethod("config", (that, mainElement) => {
      let specificClass = `control-${Math.round(Date.now() * Math.random())}`;
      let sizes = {
        ...responsiveSizes,
        "inline": {
          name: EStyle.INLINE
        }
      };
      let styles = {
        // get(attribute) {
        //   return getAttribute("inline", attribute);
        // },
        // set(attribute, value) {
        //   setAttribute("inline", attribute, value);
        // }
      };

      mainElement.id = specificClass;

      // function getAttribute(size, attribute) {
      //   switch (size) {
      //     case "inline":
      //     case EStyle.INLINE:
      //       return mainElement.style[attribute];
      //       break;

      //     default:
      //       break;
      //   }
      // }

      // function setAttribute(size, attribute, value) {
      //   switch (size) {
      //     case "inline":
      //     case EStyle.INLINE:
      //       mainElement.style[attribute] = value;
      //       break;

      //     default:
      //       break;
      //   }
      // }

      // styles.inline = {
      //   get(attribute) {
      //     return mainElement.style[attribute];
      //     // return getAttribute("inline", attribute);
      //   },
      //   set(attribute, value) {
      //     mainElement.style[attribute] = value;
      //     // setAttribute("inline", attribute, value);
      //   }
      // };

      // styles[EStyle.INLINE] = styles.inline;

      forEach(sizes, (size, sizeName) => {
        let styleSheet = mediaQueries[size.name];
        let rule;

        switch (sizeName) {
          case "inline":
            defineProperty(styles, size.name, {
              get() {
                return mainElement.style;
              }
            })
            // styles[size.name] = {
            //   get(attribute) {
            //     return mainElement.style;
            //   }
            // }
            break;

          default:
            rule = styleSheet.cssRules[styleSheet.insertRule(`#${specificClass}[element-type][element-origin="Container"]{}`, styleSheet.cssRules.length)];

            defineProperty(styles, size.name, {
              get() {
                return rule.style;
              }
            });
            // styles[size.name] = {
            //   get(attribute) {
            //     return rule.style;
            //     return getAttribute(size.name, attribute);
            //   },
            // set(attribute, value) {
            //   setAttribute(size.name, attribute, value);
            // }
            break;
        }
      });

      // Object.defineProperty(that, "style", {
      //   enumerable: true,
      //   configurable: true,
      //   get() {
      //     return styles;
      //   }
      // });

      defineProperty(that, "style", {
        get() {
          return styles;
        }
      });

      // defineMethod(that, "style", (attribute) => {
      //   let result = {};

      //   defineProperty(result, "size", {
      //     get() {
      //       return styles;
      //     },
      //     sete(v) {
      //       mainElement.style[attribute] = v;
      //     },
      //     type: String
      //   });

      //   return result;
      // });
    }, [Tigerian, [Element, DocumentFragment]]);
  }
}

export const EStyle = Object.freeze({
  INLINE: Symbol("inline"),
  // INHERIT: Symbol("inherit"),
  // INITIAL: Symbol("initial"),
  // UNSET: Symbol("unset")
});