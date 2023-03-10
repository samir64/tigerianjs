import { Behavior } from "../core/Behavior.js";
import { forEach } from "../core/Tigerian.js";
import { EResponsive, responsive } from "../core/Responsive.js";
import { Events } from "../core/Events.js";

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
 * @interface
 * @implements Behavior
 * @property {Object.<String, CSSStyleDeclaration>} style
 */
export class BStyle extends Behavior {
  /**
   * @constructor
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
      let sizes = [...responsive.sizes, EResponsive.INLINE];

      mainElement.id = specificClass;

      const writeElementStyleRule = (name) => {
        const size = responsive.size(name);
        const styleSheet = size.query;
        let rule =
          styleSheet.cssRules[
            styleSheet.insertRule(
              `#${specificClass}[data-element-type][data-element-origin="Container"]{}`,
              styleSheet.cssRules.length
            )
          ];
        rule.style.focus =
          styleSheet.cssRules[
            styleSheet.insertRule(
              `#${specificClass}[data-element-type][data-element-origin="Container"]:focus{}`,
              styleSheet.cssRules.length
            )
          ].style;
        rule.style.active =
          styleSheet.cssRules[
            styleSheet.insertRule(
              `#${specificClass}[data-element-type][data-element-origin="Container"]:active{}`,
              styleSheet.cssRules.length
            )
          ].style;
        rule.style.visited =
          styleSheet.cssRules[
            styleSheet.insertRule(
              `#${specificClass}[data-element-type][data-element-origin="Container"]:visited{}`,
              styleSheet.cssRules.length
            )
          ].style;
        rule.style.hover =
          styleSheet.cssRules[
            styleSheet.insertRule(
              `#${specificClass}[data-element-type][data-element-origin="Container"]:hover{}`,
              styleSheet.cssRules.length
            )
          ].style;

        Object.defineProperty(styles, name, {
          enumerable: true,
          configurable: true,
          get() {
            return rule.style;
          },
        });
      };

      forEach(sizes, (sizeName) => {
        switch (sizeName) {
          case EResponsive.INLINE:
            Object.defineProperty(styles, sizeName, {
              enumerable: true,
              configurable: true,
              get() {
                return mainElement.style;
              },
            });
            break;

          default:
            writeElementStyleRule(sizeName);
            // rule = styleSheet.cssRules[styleSheet.insertRule(`#${specificClass}[data-element-type][data-element-origin="Container"]{}`, styleSheet.cssRules.length)];

            // Object.defineProperty(styles, sizeName, {
            //   enumerable: true,
            //   configurable: true,
            //   get() {
            //     return rule.style;
            //   }
            // });
            break;
        }
      });

      Object.defineProperty(that, "style", {
        enumerable: true,
        configurable: false,
        get() {
          return styles;
        },
      });

      Object.defineProperty(that, "id", {
        enumerable: true,
        configurable: false,
        get() {
          return specificClass;
        },
      });

      responsive.addEvent(Events.onMediaQueryAdd, (e) => {
        writeElementStyleRule(e.data);
      });

      responsive.addEvent(Events.onMediaQueryRemove, (e) => {
        delete styles[e.data];
      });
    };
  }
}

// export const EStyle = Object.freeze({
//   INLINE: Symbol("inline"),
// });
