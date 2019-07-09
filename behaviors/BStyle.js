import {
  Behavior
} from "../core/Behavior.js";
import {
  UI
} from "../core/UI.js";
import {
  strSplitCapital
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
      var defineAttribute = function (root, attribute, getter, setter) {
        if (!(attribute[0] in root)) {
          root[attribute[0]] = {};
        }

        if (attribute.length > 1) {
          defineAttribute(
            root[attribute[0]],
            attribute.slice(1),
            getter,
            setter
          );
        }
      };

      var optimizeAttributes = function (root) {
        var result = {};

        for (var attr in root) {
          var keys = Object.keys(root[attr]);
          if (keys.length === 0) {
            result[attr] = root[attr];
          } else if (keys.length === 1) {
            var nextNode = keys[0];
            result[attr + nextNode.charAt(0).toUpperCase() + nextNode.slice(1)] =
              root[attr][nextNode];
          } else {
            result[attr] = optimizeAttributes(root[attr]);
          }
        }

        return result;
      };

      var defineDescriptors = function (root, key, source) {
        for (var attr in root) {
          var keys = Object.keys(root[attr]);
          var styleAttr =
            key === "" ?
            attr :
            key + attr.charAt(0).toUpperCase() + attr.slice(1);
          if (keys.length === 0) {
            (function (styleAttr) {
              Object.defineProperty(root, attr, {
                enumerable: true,
                configurable: true,
                get: function () {
                  return source[styleAttr];
                },
                set: function (v) {
                  source[styleAttr] = v;
                }
              });
            })(styleAttr);
          } else {
            defineDescriptors(root[attr], styleAttr, source);
          }
        }
      };

      var result = {};

      for (var prop in mainElement.style) {
        var p = prop;
        if (p.indexOf("-") === -1) {
          var attrs = strSplitCapital(prop);

          defineAttribute(
            result,
            attrs,
            function () {
              return mainElement.style[prop];
            },
            function (v) {
              mainElement.style[prop] = v;
            }
          );
        }
      }

      result = optimizeAttributes(result);
      defineDescriptors(result, "", mainElement.style);

      Object.defineProperty(that, "style", {
        enumerable: true,
        configurable: true,
        get: function () {
          return result;
        }
      });
    }, [UI, Element]);
  }
}

export const EStyle = Object.freeze({
  INHERIT: Symbol("inherit"),
  INITIAL: Symbol("initial"),
  UNSET: Symbol("unset")
});