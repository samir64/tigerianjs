import {
  Behavior
} from "../core/Behavior.js";
import {
  strSplitCapital,
  forEach,
  Tigerian,
  instanceOf,
} from "../core/Tigerian.js";
import {
  responsiveSizes
} from "../core/Responsive.js";
import {
  EWindow
} from "./BWindow.js";

("use strict");

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
      var styleElement = document.createElement("style");
      var specificClass = `control-${Math.round(Date.now() * Math.random())}`;
      var styleProperty = {};

      var nodeStyles = {}

      var defineAttribute = (root, attributes, getter, setter, propName) => {
        if (attributes.length === 1) {
          if (attributes[0] in root) {
            var descriptor = Object.getOwnPropertyDescriptor(root, attributes[0]);

            Object.defineProperty(root, attributes[0], {
              enumerable: true,
              configurable: true,
              get: descriptor.get,
              set: setter
            });
          } else {
            Object.defineProperty(root, attributes[0], {
              enumerable: true,
              configurable: true,
              get() {
                var result = {};

                forEach(responsiveSizes, (size, sizeName) => {
                  Object.defineProperty(result, size.name, {
                    get() {},
                    set(v) {
                      if (instanceOf(v, String)) {
                        if (v === "") {
                          nodeStyles[size.name][propName].data = "";
                        } else {
                          nodeStyles[size.name][propName].data = `${" ".repeat(8)}${propName}: ${v};\n`;
                        }
                      } else if (instanceOf(v, Symbol)) {}
                    },
                    enumerable: true,
                    configurable: true
                  });
                  // result[size.name] = getter;
                });

                Object.defineProperty(result, EStyle.INLINE, {
                  get: getter,
                  set: setter,
                  enumerable: true,
                  configurable: true
                });

                return result;
              },
              set: setter
            });
            // Object.defineProperty(root, attributes[0], {
            //   enumerable: true,
            //   configurable: true,
            //   get: getter,
            //   set: setter
            // });
          }
        } else {
          var res;
          if (attributes[0] in root) {
            res = Object.getOwnPropertyDescriptor(root, attributes[0]).get();
            if (instanceOf(res, String)) {
              res = {};
            }
          } else {
            res = {}
          }

          Object.defineProperty(root, attributes[0], {
            enumerable: true,
            configurable: true,
            get() {
              return res;
            }
          });

          defineAttribute(res, attributes.slice(1), getter, setter, propName);
        }
      };

      forEach(mainElement.style, (prop, propName, style) => {
        if (parseInt(propName) != propName) {
          if ((propName.indexOf("-") === -1)) {
            var attrs = strSplitCapital(propName);

            var propDashName = attrs.join("-");

            forEach(responsiveSizes, (size, sizeName) => {
              if (nodeStyles[size.name] === undefined) {
                nodeStyles[size.name] = {};
              }

              nodeStyles[size.name][propDashName] = document.createTextNode("");
            });

            defineAttribute(styleProperty, attrs, () => {
              return style[propName];
            }, (v) => {
              style[propName] = v;
            }, propDashName);
          }
        }
      });

      document.head.appendChild(styleElement);
      mainElement.classList.add(specificClass);

      forEach(responsiveSizes, (size, sizeName) => {
        if (size.min) {
          styleElement.appendChild(document.createTextNode(`@media only screen and (min-width: ${size.min}px) {\n`));
        } else {
          styleElement.appendChild(document.createTextNode(`@media only screen and (max-width: ${size.max}px) {\n`));
        }
        styleElement.appendChild(document.createTextNode(`${" ".repeat(4)}[element-type][element-name="container"].${specificClass} {\n`));

        forEach(nodeStyles[size.name], (prop, propName) => {
          styleElement.appendChild(prop);
        });

        styleElement.appendChild(document.createTextNode(`${" ".repeat(4)}}\n`));
        styleElement.appendChild(document.createTextNode(`}\n\n`));
      });

      Object.defineProperty(that, "style", {
        enumerable: true,
        configurable: true,
        get: function () {
          return styleProperty;
        }
      });
    }, [Tigerian, Element]);
  }
}

export const EStyle = Object.freeze({
  INLINE: Symbol("inline"),
  // INHERIT: Symbol("inherit"),
  // INITIAL: Symbol("initial"),
  // UNSET: Symbol("unset")
});