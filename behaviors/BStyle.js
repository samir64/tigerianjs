import {
  Behavior
} from "../core/Behavior.js";
import {
  strSplitCapital,
  forEach,
  Tigerian,
  instanceOf,
} from "../core/Tigerian.js";

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
      var defineAttribute = (root, attributes, getter, setter) => {
        /* if ((attributes[0] === "padding") && (attributes.length === 1)) {
          console.log({
            root,
            attributes
          });
          debugger;
        } */

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
              get: getter,
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
            res = {}
          }

          Object.defineProperty(root, attributes[0], {
            enumerable: true,
            configurable: true,
            get() {
              return res;
            }
          });

          defineAttribute(res, attributes.slice(1), getter, setter);
        }
      };

      var result = {};

      forEach(mainElement.style, (prop, name, style) => {
        if ((parseInt(name) != name) && (name.indexOf("-") === -1)) {
          var attrs = strSplitCapital(name);
          defineAttribute(result, attrs, () => {
            return style[name]
          }, (v) => {
            style[name] = v;
          });
        }
      });

      Object.defineProperty(that, "style", {
        enumerable: true,
        configurable: true,
        get: function () {
          return result;
        }
      });
    }, [Tigerian, Element]);
  }
}

export const EStyle = Object.freeze({
  INHERIT: Symbol("inherit"),
  INITIAL: Symbol("initial"),
  UNSET: Symbol("unset")
});