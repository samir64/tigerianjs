/**
 * Created by samir on 06/06/20.
 */

import { responsive, EResponsive } from "./Responsive.js";
import {
  changeStringCase,
  EStringCase,
  forEach,
  instanceOf,
  isA,
  Tigerian,
  // abstract
} from "./Tigerian.js";
import { EMethod, UI } from "./UI.js";

/**
 * @typedef {Object} SELECTOR
 * @property {String|EValue} childType
 * @property {String|EValue} childName
 * @property {JSON} attributes
 * @property {String|EValue} childTag
 * @property {Boolean} nextLevel
 */
/**
 * @extends Tigerian
 */
export class Theme extends Tigerian {
  /**
   * @param {Object} type
   */
  constructor() {
    super();
    this.abstract(Theme);

    const selectorRules = (selectors) => {
      let result = "";

      forEach(selectors, (selector) => {
        let {
          childType,
          childName,
          childTag,
          attributes,
          nextLevel,
        } = selector;
        if (
          !!childType ||
          !!childName ||
          !!childTag ||
          selector === EValue.STAR
        ) {
          result += !!nextLevel ? ">" : " ";

          if (childTag === EValue.STAR || selector === EValue.STAR) {
            result += "*";
          } else {
            if (childTag) {
              result += childTag;
            }

            if (childType) {
              result += `[data-element-type`;
              if (childType !== EValue.STAR) {
                result += `="${childType}"`;
              }
              result += `]`;
            }

            if (childName) {
              result += `[data-element-name`;
              if (childName !== EValue.STAR) {
                result += `="${childName}"`;
              }
              result += `]`;
            }

            forEach(attributes, (value, attribute) => {
              result += `[data-${attribute}`;
              if (value !== EValue.STAR) {
                result += `="${value}"`;
              }
              result += `]`;
            });
          }
        }
      });

      return result;
    };

    const attributeRules = (attributes) => {
      let result = "";

      forEach(attributes, (value, attribute) => {
        result += `[data-${changeStringCase(
          EStringCase.SNAKE_CASE,
          attribute
        )}`;
        if (value !== EValue.STAR) {
          result += `="${value.toString()}"`;
        }
        result += `]`;
      });

      return result;
    };

    const styleRules = (styles) => {
      let result = "";

      forEach(styles, (value, style) => {
        result += `${changeStringCase(
          EStringCase.KEBAB_CASE,
          style
        )}: ${value};`;
      });

      return result;
    };

    const converter = {
      /**
       * @param {String} value
       * @returns {EFormat}
       */
      getFormat: (value) => {},
      /**
       * @param {String} value
       * @returns {{red: Number, green: Number, blue: Number}}
       */
      hexToRgb: (value) => {
        let r = 0,
          g = 0,
          b = 0;

        if (value.length == 4) {
          r = "0x" + value[1] + value[1];
          g = "0x" + value[2] + value[2];
          b = "0x" + value[3] + value[3];
        } else if (value.length == 7) {
          r = "0x" + value[1] + value[2];
          g = "0x" + value[3] + value[4];
          b = "0x" + value[5] + value[6];
        }

        return {
          red: r,
          green: g,
          blue: b,
        };
      },
      /**
       * @param {String} value
       * @returns {{red: Number, green: Number, blue: Number, alpha: Number}}
       */
      hexAToRgbA: (value) => {
        let r = 0,
          g = 0,
          b = 0,
          a = 0;

        if (value.length == 5) {
          r = "0x" + value[1] + value[1];
          g = "0x" + value[2] + value[2];
          b = "0x" + value[3] + value[3];
          a = "0x" + value[4] + value[4];
        } else if (value.length == 8) {
          r = "0x" + value[1] + value[2];
          g = "0x" + value[3] + value[4];
          b = "0x" + value[5] + value[6];
          a = "0x" + value[7] + value[8];
        }

        return {
          red: r,
          green: g,
          blue: b,
          alpha: a,
        };
      },
      /**
       * @param {String} value
       * @returns {{hue: Number, saturation: Number, lightness: Number}}
       */
      hexToHsl: (value) => {},
      /**
       * @param {String} value
       * @returns {{hue: Number, saturation: Number, lightness: Number, alpha: Number}}
       */
      hexAToHslA: (value) => {},
      /**
       * @param {Number} red
       * @param {Number} green
       * @param {Number} blue
       * @returns {String}
       */
      rgbToHex: ({ red, green, blue }) => {
        let r = red.toString(16),
          g = green.toString(16),
          b = blue.toString(16);

        if (r.length == 1) {
          r = "0" + r;
        }
        if (g.length == 1) {
          g = "0" + g;
        }
        if (b.length == 1) {
          b = "0" + b;
        }

        return `#${r}${g}${b}`;
      },
      /**
       * @param {Number} red
       * @param {Number} green
       * @param {Number} blue
       * @param {Number} alpha
       * @returns {String}
       */
      rgbAToHexA: ({ red, green, blue, alpha }) => {
        let r = red.toString(16),
          g = green.toString(16),
          b = blue.toString(16),
          a = alpha.toString(16);

        if (r.length == 1) {
          r = "0" + r;
        }
        if (g.length == 1) {
          g = "0" + g;
        }
        if (b.length == 1) {
          b = "0" + b;
        }
        if (b.length == 1) {
          a = "0" + a;
        }

        return `#${r}${g}${b}${a}`;
      },
      /**
       * @param {{red: Number, green: Number, blue: Number}} value
       * @returns {{hue: Number, saturation: Number, lightness: Number}}
       */
      rgbToHsl: (value) => {},
      /**
       * @param {{red: Number, green: Number, blue: Number, alpha: Number}} value
       * @returns {{hue: Number, saturation: Number, lightness: Number, alpha: Number}}
       */
      rgbAToHslA: ({ red, green, blue, aplha }) => {
        let h, s, l, a;

        return {
          hue: h,
          saturation: s,
          lightness: l,
          alpha: a,
        };
      },
      /**
       * @param {{hue: Number, saturation: Number, lightness: Number}} value
       * @returns {String}
       */
      hslToHex: (value) => {},
      /**
       * @param {{hue: Number, saturation: Number, lightness: Number, alpha: Number}} value
       * @returns {String}
       */
      hslAToHexA: (value) => {},
      /**
       * @param {{hue: Number, saturation: Number, lightness: Number}} value
       * @returns {{red: Number, green: Number, blue: Number}}
       */
      hslToRgb: (value) => {},
      /**
       * @param {{hue: Number, saturation: Number, lightness: Number, alpha: Number}} value
       * @returns {{red: Number, green: Number, blue: Number, alpha: Number}}
       */
      hslAToRgbA: (value) => {},
      // nameToHex: value => {},
      // nameToRgb: value => {},
      // nameToHsl: value => {},
    };

    /**
     * @param {Function} type
     * @param {JSON} styles
     * @param {JSON} attributes
     * @param {EResponsive} size
     * @param {SELECTOR} selectors
     */
    this.addRule = (
      type,
      styles,
      attributes = {},
      size = EResponsive.XSMALL,
      ...selectors
    ) => {
      if (size === EResponsive.INLINE) {
        throw new Error("Style can't apply on INLINE");
      }

      if (isA(type, UI)) {
        const styleSheet = responsive.size(size).query;
        let rule = `[data-element-name="container"][data-element-type="${type.name}"][data-element-origin="Container"]`;

        rule += attributeRules(attributes);
        rule += selectorRules(selectors);

        rule += `{`;
        rule += styleRules(styles);
        rule += `}`;
        return styleSheet.cssRules[
          styleSheet.insertRule(rule, styleSheet.cssRules.length)
        ];
      }
    };

    /**
     * @param {Function} control
     * @param {EResponsive} size
     * @param {JSON} attributes
     * @param {JSON} styles
     * @param {SELECTOR} selectors
     */
    this.addStyle = (
      control,
      styles,
      attributes = {},
      size = EResponsive.XSMALL,
      ...selectors
    ) => {
      if (size === EResponsive.INLINE) {
        throw new Error("Style can't apply on INLINE");
      }

      if (instanceOf(control, UI)) {
        const styleSheet = responsive.size(size).query;
        let rule = `#${control.id}[data-element-name="container"][data-element-origin="Container"]`;

        rule += attributeRules(attributes);
        rule += selectorRules(selectors);

        rule += `{`;
        rule += styleRules(styles);
        rule += `}`;
        return styleSheet.cssRules[
          styleSheet.insertRule(rule, styleSheet.cssRules.length)
        ];
      }
    };

    /**
     * @callback PROPERTY_CALLBACK
     * @param {EMethod} method
     * @param {*} value
     */
    /**
     *
     * @param {String} variable
     * @param {Function} type
     * @param {String} postfix
     * @param {*} defaultValue
     * @param {EResponsive} size
     * @param {PROPERTY_CALLBACK} callback
     */
    this.addVariable = (
      variable,
      type = String,
      defaultValue = "",
      postfix = "",
      callback = (method, value) => value
    ) => {
      let varName = `--${changeStringCase(EStringCase.KEBAB_CASE, variable)}`;
      // responsive.root.style[varName] = `${defaultValue}${postfix}`;
      responsive.root.style.setProperty(varName, defaultValue + postfix);

      if (!instanceOf(defaultValue, type)) {
        if (!instanceOf(defaultValue, type)) {
          throw new Error(
            `${variable} expected ${
              /^function\s+(\w+)/.exec(type)[1]
            } but got ${typeof defaultValue}`
          );
        }
      }

      Object.defineProperty(this, variable, {
        enumerable: true,
        configurable: false,
        get() {
          let value = responsive.root.style.getPropertyValue(varName);
          value = new RegExp(`^([\\w.#]+)${postfix}$`).exec(value)[1];
          if (type === Number) {
            value = parseFloat(value);
          }
          callback(EMethod.GET, value);
          return value;
        },
        set(v) {
          callback(EMethod.SET, v);
          if (instanceOf(v, type)) {
            responsive.root.style.setProperty(varName, v + postfix);
          } else {
            throw new Error(`${variable} expected ${type} but got ${typeof v}`);
          }
        },
      });
    };

    this.variable = (variable) =>
      `var(--${changeStringCase(EStringCase.KEBAB_CASE, variable)})`;

    /**
     *
     * @param {String} value
     * @param {EFormat} [toFormat = EFormat.RGBA]
     */
    this.convertColor = (value, toFormat = EFormat.RGBA) => {
      const valueFormat = converter.getFormat(value);
      if (valueFormat === toFormat) {
        return value;
      }

      switch (valueFormat) {
        case EFormat.Hex:
          switch (toFormat) {
            case EFormat.RGB:
              return converter.hexToRgb(value);
              break;

            default:
          }
          break;

        default:
      }
    };
  }
}

export const EValue = Object.freeze({
  STAR: Symbol("star"),
});

export const EFormat = Object.freeze({
  RGB: Symbol("rgb"),
  RGBA: Symbol("rgba"),
  HSL: Symbol("hsl"),
  HSLA: Symbol("hsla"),
  HEX: Symbol("hex"),
});
