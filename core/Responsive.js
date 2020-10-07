"use strict";

// import {
//   EWindow
// } from "../behaviors/BWindow.js";
import {
  forEach,
  instanceOf,
  Tigerian
} from "./Tigerian.js";

let instance;

class Responsive extends Tigerian {
  constructor() {
    if (instance) {
      return instance;
    }

    super();

    instance = this;

    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
    // const queries = {};
    // const containerRules = {};
    // const sizeNames = ["xsmall", "small", "medium", "large", "xlarge"];
    // const sizeNames = [EResponsive.XSMALL, EResponsive.SMALL, EResponsive.MEDIUM, EResponsive.LARGE, EResponsive.XLARGE];
    const sizes = {
      names: [EResponsive.XSMALL, EResponsive.SMALL, EResponsive.MEDIUM, EResponsive.LARGE, EResponsive.XLARGE],
    };

    sizes[EResponsive.XSMALL] = {
      min: undefined,
      max: undefined,
      containerWidth: "100%",
      gutter: 0,
      query: {},
      containerStyle: undefined,
    };
    sizes[EResponsive.SMALL] = {
      min: 576,
      max: undefined,
      containerWidth: "575px",
      gutter: 0,
      query: {},
      containerStyle: undefined,
    };
    sizes[EResponsive.MEDIUM] = {
      min: 768,
      max: undefined,
      containerWidth: "750px",
      gutter: 15,
      query: {},
      containerStyle: undefined,
    };
    sizes[EResponsive.LARGE] = {
      min: 992,
      max: undefined,
      containerWidth: "970px",
      gutter: 15,
      query: {},
      containerStyle: undefined,
    };
    sizes[EResponsive.XLARGE] = {
      min: 1200,
      max: undefined,
      containerWidth: "1170px",
      gutter: 15,
      query: {},
      containerStyle: undefined,
    };

    const writeContainerStyle = name => {
      ;
    }

    const responsive = () => {
      let rule = "";
      let meta = document.createElement("meta");

      document.head.appendChild(meta);

      meta.setAttribute("name", "viewport");
      meta.setAttribute("content", "width=device-width, initial-scale=1.0");

      forEach(sizes.names, (name, index) => {
        // const strName = name.toString().match(/\w+\((\w+)\)/)[1];
        const size = sizes[name];

        rule = `[data-element-type="Container"] [data-element-type="ContainerRow"]>[data-element-type="ContainerColumn"][data-element-origin="Container"] {`;
        rule += `flex: 0 0 calc(var(--column) * 100% / var(--column-count));`;
        rule += `padding: 0 var(--gutter);`;
        rule += "}";
        size.query.rule.insertRule(rule, size.query.rule.cssRules.length);

        // for (let col = 1; col <= columnsCount; col++) {
        //   rule = `[data-element-type="Container"] [data-element-type="ContainerRow"]>[data-element-type="ContainerColumn"][data-element-origin="Container"][data-${strName}-column="${col}"] {`;
        //   rule += `flex: 0 0 calc(${(col * 100)}% / var(--column-count));`;
        //   rule += `padding: 0 var(--gutter);`;
        //   rule += "}";
        //   size.query.rule.insertRule(rule, size.query.rule.cssRules.length);
        // }

        // rule = `[data-element-origin="Container"][hide-on-${strName}="true"] {display: none;}`;
        // size.query.rule.insertRule(rule, size.query.rule.cssRules.length);

        rule = `[data-element-type="Container"][data-element-origin="Container"] {`;
        rule += `--gutter: ${size.gutter}px;`;
        rule += `max-width: ${size.containerWidth};`;
        rule += "margin-left: auto;";
        rule += "margin-right: auto;";
        // rule += `padding: var(--padding-v) ${gutter / 1}px;`;
        rule += "display: flex;";
        rule += "flex-wrap: wrap;";
        rule += "justify-content: space-between;";
        rule += "padding: 15px;";
        rule += "}";
        size.containerStyle = size.query.rule.cssRules[size.query.rule.insertRule(rule, size.query.rule.cssRules.length)].style;

        rule = `[data-element-type="Container"][data-element-origin="Container"] [data-element-type="ContainerRow"][data-element-origin="Container"] {`;
        rule += `width: calc(100% + 2 * var(--gutter));`;
        rule += "display: flex;";
        rule += "flex-wrap: wrap;";
        rule += `margin: 0 calc(-1 * var(--gutter));`;
        rule += "}";
        size.query.rule.insertRule(rule, size.query.rule.cssRules.length);

        rule = `[data-element-type="Container"] [data-element-type="ContainerRow"]>[data-element-type="ContainerColumn"][data-element-origin="Container"] {`;
        rule += "display: flex;";
        rule += "flex-direction: column;";
        rule += "}";
        size.query.rule.insertRule(rule, size.query.rule.cssRules.length);
      });
    };

    const defineQueries = () => {
      forEach(sizes.names, name => {
        const size = sizes[name];
        let rule = "@media only screen";

        if (size.min) {
          rule += ` and (min-width: ${size.min}px)`;
        }
        if (size.max) {
          rule += ` and (max-width: ${size.max}px)`;
        }
        rule += " {}";

        size.query.index = styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length);
        size.query.rule = styleElement.sheet.cssRules[size.query.index];
      });
    };

    document.head.appendChild(styleElement);
    defineQueries();
    responsive();

    Object.defineProperty(this, "sizes", {
      get() {
        return sizes.names;
      },
      enumerable: true,
      configurable: true
    });

    this.size = name => {
      let result = {
        get min() {
          return sizes[name].min;
        },
        get max() {
          return sizes[name].max;
        },
        get containerWidth() {
          return sizes[name].containerWidth;
        },
        get gutter() {
          return sizes[name].gutter;
        },
        set min(value) {
          sizes[name].min = value;
          let rule = "only screen";

          if (value) {
            rule += ` and (min-width: ${value}px)`;
          }
          if (sizes[name].max) {
            rule += ` and (max-width: ${sizes[name].max}px)`;
          }

          sizes[name].query.rule.conditionText = rule;
        },
        set max(value) {
          sizes[name].max = value;
          let rule = "only screen";

          if (sizes[name].min) {
            rule += ` and (min-width: ${sizes[name].min}px)`;
          }
          if (value) {
            rule += ` and (max-width: ${value}px)`;
          }

          sizes[name].query.conditionText = rule;
        },
        set containerWidth(value) {
          sizes[name].containerWidth = value;
          sizes[name].containerStyle.maxWidth = value;
        },
        set gutter(value) {
          sizes[name].gutter = value;
          sizes[name].containerStyle.setProperty("--gutter", `${value}px`);
        },
        get query() {
          if (sizes.names.indexOf(name) >= 0) {
            return sizes[name].query.rule
          }
        },
      };

      return result;
    };

    this.addQuery = (name, {
      min,
      max,
      containerWidth,
    }) => {
      let rule = "@media only screen";

      if (instanceOf(name, Symbol) && ((min === undefined) || instanceOf(min, Number)) && ((max === undefined) || instanceOf(max, Number)) && instanceOf(containerWidth, String)) {
        sizes[name] = {
          min,
          max,
          containerWidth,
          containerStyle: {},
          query: {},
        };

        let size = sizes[name];
        let index = 0;
        const strName = name.toString().match(/\w+\((\w+)\)/)[1];

        if (min) {
          rule += ` and (min-width: ${min}px)`;
        }
        if (max) {
          rule += ` and (max-width: ${max}px)`;
        }
        rule += " {}";

        // TODO Callback an event to BStyle for adding this query to all of styles.

        while ((index < sizes.names.length) && ((sizes[sizes.names[index]].min === undefined) || (sizes[sizes.names[index]].min < min))) {
          index++;
        }

        size.query.index = styleElement.sheet.insertRule(rule, sizes[sizes.names[index]].query.index);
        size.query.rule = styleElement.sheet.cssRules[size.query.index];
        sizes.names.splice(index, 0, name);

        for (let col = 1; col <= columnsCount; col++) {
          rule = `[data-${strName}-column="${col}"]`;
          rule += `{width: calc(${(col * 100) / columnsCount}% - 2 * ${gutter}px);`;
          size.query.rule.insertRule(rule, size.query.rule.cssRules.length);
        }

        rule = `[data-element-origin="Container"][hide-on-${strName}="true"] {display: none;}`;
        size.query.rule.insertRule(rule, size.query.rule.cssRules.length);

        rule = `[data-element-type="Container"][data-element-origin="Container"] {`;
        rule += `max-width: ${size.containerWidth};`;
        rule += "margin-left: auto;";
        rule += "margin-right: auto;";
        rule += `padding: var(--padding-v) ${gutter};`;
        rule += "display: block;}";
        size.containerStyle = size.query.rule.cssRules[size.query.rule.insertRule(rule, size.query.rule.cssRules.length)].style;
      }
    }
  }
}

export const EResponsive = Object.freeze({
  INLINE: Symbol("inline"),
  XSMALL: Symbol("xsmall"),
  SMALL: Symbol("small"),
  MEDIUM: Symbol("medium"),
  LARGE: Symbol("large"),
  XLARGE: Symbol("xlarge"),
});

export const responsive = new Responsive();