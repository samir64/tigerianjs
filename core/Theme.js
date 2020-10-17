/**
 * Created by samir on 06/06/20.
 */

import {
  responsive,
  EResponsive
} from "./Responsive.js";
import {
  forEach,
  instanceOf,
  isA,
  Tigerian,
  // abstract
} from "./Tigerian.js";
import {
  UI
} from "./UI.js";

"use strict";

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
   * @param {String} name
   * @param {Object} type
   */
  constructor(name) {
    super();
    this.abstract(Theme);

    if (!!name) {
      name = `.${name}`;
    }

    const snakeCase = value => value.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('_');

    const kebabCase = value => value.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('-');

    const selectorRules = selectors => {
      let result = "";

      forEach(selectors, selector => {
        let {
          childType,
          childName,
          childTag,
          attributes,
          nextLevel
        } = selector;
        if (!!childType || !!childName || !!childTag || (selector === EValue.STAR)) {
          result += !!nextLevel ? ">" : " ";

          if ((childTag === EValue.STAR) || (selector === EValue.STAR)) {
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
    }

    const attributeRules = attributes => {
      let result = "";

      forEach(attributes, (value, attribute) => {
        result += `[data-${snakeCase(attribute)}`;
        if (value !== EValue.STAR) {
          result += `="${value.toString()}"`;
        }
        result += `]`;
      });

      return result;
    }

    const styleRules = styles => {
      let result = "";

      forEach(styles, (value, style) => {
        result += `${kebabCase(style)}: ${value};`;
      });

      return result;
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
      styles, attributes = {},
      size = EResponsive.XSMALL, ...selectors
    ) => {
      if (size === EResponsive.INLINE) {
        throw new Error("Style can't apply on INLINE");
      }

      if (isA(type, UI)) {
        const styleSheet = responsive.size(size).query;
        let rule = `${name}[data-element-name="container"][data-element-type="${type.name}"][data-element-origin="Container"]`;

        rule += attributeRules(attributes);
        rule += selectorRules(selectors);

        rule += `{`;
        rule += styleRules(styles);
        rule += `}`;
        return styleSheet.cssRules[styleSheet.insertRule(rule, styleSheet.cssRules.length)];
      }
    };

    /**
     * @param {Function} type
     * @param {EResponsive} size
     * @param {JSON} attributes
     * @param {JSON} styles
     * @param {SELECTOR} selectors
     */
    this.addStyle = (
      control,
      styles, attributes = {},
      size = EResponsive.XSMALL,
      ...selectors
    ) => {
      if (size === EResponsive.INLINE) {
        throw new Error("Style can't apply on INLINE");
      }

      if (instanceOf(control, UI)) {
        const styleSheet = responsive.size(size).query;
        let rule = `#${control.id}${name}[data-element-name="container"][data-element-origin="Container"]`;

        rule += attributeRules(attributes);
        rule += selectorRules(selectors);

        rule += `{`;
        rule += styleRules(styles);
        rule += `}`;
        return styleSheet.cssRules[styleSheet.insertRule(rule, styleSheet.cssRules.length)];
      }
    };

    /**
     * 
     * @param {String} variable 
     * @param {Function} type 
     * @param {String} prefix 
     * @param {*} defaultValue 
     * @param {EResponsive} size 
     */
    this.addVariable = (variable, type, defaultValue, prefix) => {
      let varName = `--${kebabCase(variable)}`;
      // responsive.root.style[varName] = `${defaultValue}${prefix}`;
      responsive.root.style.setProperty(varName, defaultValue + prefix);

      if (!instanceOf(defaultValue, type)) {
        if (!instanceOf(defaultValue, type)) {
          throw new Error(`${variable} expected ${/^function\s+(\w+)/.exec(type)[1]} but got ${typeof defaultValue}`);
        }
      }

      console.log(responsive.root);
      Object.defineProperty(this, variable, {
        enumerable: true,
        configurable: false,
        get() {
          let value = responsive.root.style.getPropertyValue(varName);
          value = new RegExp(`^(\\w+)${prefix}$`).exec(value)[1];
          return value;
        },
        set(v) {
          if (instanceOf(defaultValue, type)) {
            responsive.root.style.setProperty(varName, v + prefix);
          } else {
            throw new Error(`${variable} expected ${type} but got ${typeof v}`);
          }
        },
      });
    }

    this.variable = variable => `var(--${kebabCase(variable)})`;
  }
}

export const ESituation = Object.freeze({
  NONE: Symbol("none"),
  DEFAULT: Symbol("default"),
  TITLE: Symbol("title"),
  INFO: Symbol("info"),
  TRANSPARENT: Symbol("transparent"),
  OPPOSITE: Symbol("opposite"),
  WARNING: Symbol("warning"),
  ERROR: Symbol("error"),
  OK: Symbol("ok"),
});

export const EValue = Object.freeze({
  STAR: Symbol("star"),
});