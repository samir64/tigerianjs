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

var allStylesList = [];

forEach(document.body.style, (prop, propName) => {
  allStylesList.push(propName);
});

allStylesList = allStylesList.filter((item) => {
  return (item[0] < "A" || item[0] > "Z") && !allStylesList.some((it) => {
    return (it !== item) && (it.replace(/-/g, "") === item.toLowerCase());
  });
});


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
      var specificClass = `control-${Math.round(Date.now() * Math.random())}`;
      var styleElement = document.createElement("style");
      var styleProperty = {};
      var nodeStyles = {};
      var fragment = document.createDocumentFragment();
      var emptyNode = document.createTextNode("");
      var cloneNode = (text) => {
        var result = emptyNode.cloneNode(false);
        result.data = text;

        return result;
      };
      var style = mainElement.style;

      var addPageSizes = (getter, setter, propName, result = {}) => {
        forEach(responsiveSizes, (size, sizeName) => {
          Object.defineProperty(result, size.name, {
            get() {
              var re = /\s*[\w-]+\s*:\s*([\w-'"\(\)\.%\s]+);/;
              var result = re.exec(nodeStyles[size.name][propName].data);
              return ((result !== null) ? result[1].trim() : "");
            },
            set(v) {
              if (instanceOf(v, String)) {
                if (v === "") {
                  nodeStyles[size.name][propName].data = "";
                } else {
                  nodeStyles[size.name][propName].data = `\t\t${propName}: ${v};\n`;
                }
              } else if (instanceOf(v, Symbol)) {}
            },
            enumerable: true,
            configurable: true
          });
        });

        Object.defineProperty(result, EStyle.INLINE, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });

        return result;
      };

      var defineAttribute = (root, attributes, getter, setter, propName) => {
        if (attributes.length === 1) {
          if (attributes[0] in root) {
            var descriptor = Object.getOwnPropertyDescriptor(root, attributes[0]);

            Object.defineProperty(root, attributes[0], {
              enumerable: true,
              configurable: true,
              get() {
                return addPageSizes(getter, setter, propName, descriptor.get());
              },
              set: setter
            });
          } else {
            Object.defineProperty(root, attributes[0], {
              enumerable: true,
              configurable: true,
              get() {
                return addPageSizes(getter, setter, propName);
              },
              set: setter
            });
          }
        } else {
          var res;
          if (attributes[0] in root) {
            res = Object.getOwnPropertyDescriptor(root, attributes[0]).get();
            if (instanceOf(res, String)) {
              res = {};
            }
          } else {
            res = {};
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

      forEach(allStylesList, (propName) => {
        if (parseInt(propName) != propName) {
          // if ((propName.indexOf("-") === -1) && ((propName[0] < "A") || (propName[0] > "Z"))) {
          var propNameClear = propName.replace(/^-*(\w[\w-]+\w)-*$/, "$1");
          var attrs = propNameClear.split("-");
          // console.log(propName, propNameClear, attrs);

          // var propDashName = attrs.join("-");

          forEach(responsiveSizes, (size, sizeName) => {
            if (nodeStyles[size.name] === undefined) {
              nodeStyles[size.name] = {};
            }

            nodeStyles[size.name][propNameClear] = cloneNode("");
          });

          defineAttribute(styleProperty, attrs, () => {
            return style[propName];
          }, (v) => {
            style[propName] = v;
          }, propNameClear);
          // }
        }
      });

      // mainElement.classList.add(specificClass);
      mainElement.id = specificClass;

      forEach(responsiveSizes, (size, sizeName) => {
        if (size.min) {
          fragment.appendChild(cloneNode(`@media only screen and (min-width: ${size.min}px) {\n`));
        } else {
          fragment.appendChild(cloneNode(`@media only screen and (max-width: ${size.max}px) {\n`));
        }
        fragment.appendChild(cloneNode(`\t#${specificClass}[element-type][element-name="container"] {\n`));

        forEach(nodeStyles[size.name], (prop, propName) => {
          fragment.appendChild(prop);
        });

        fragment.appendChild(cloneNode(`\t}\n`));
        fragment.appendChild(cloneNode(`}\n\n`));
      });

      styleElement.appendChild(fragment);
      document.head.appendChild(styleElement);

      Object.defineProperty(that, "style", {
        enumerable: true,
        configurable: true,
        get: function () {
          return styleProperty;
        }
      });
    }, [Tigerian, [Element, DocumentFragment]]);
  }
}

export const EStyle = Object.freeze({
  INLINE: Symbol("inline"),
  // INHERIT: Symbol("inherit"),
  // INITIAL: Symbol("initial"),
  // UNSET: Symbol("unset")
});