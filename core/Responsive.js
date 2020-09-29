("use strict");

import {
  EWindow
} from "../behaviors/BWindow.js";
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
    const queries = {};
    // const sizeNames = ["xsmall", "small", "medium", "large", "xlarge"];
    const sizeNames = [EWindow.XSMALL, EWindow.SMALL, EWindow.MEDIUM, EWindow.LARGE, EWindow.XLARGE];
    const sizes = {};

    sizes[EWindow.XSMALL] = {
      min: 1,
      max: undefined,
      containerWidth: "100%",
      containerPadding: 0,
    };
    sizes[EWindow.SMALL] = {
      min: 576,
      max: undefined,
      containerWidth: "575px",
      containerPadding: 15,
    };
    sizes[EWindow.MEDIUM] = {
      min: 768,
      max: undefined,
      containerWidth: "750px",
      containerPadding: 15,
    };
    sizes[EWindow.LARGE] = {
      min: 992,
      max: undefined,
      containerWidth: "970px",
      containerPadding: 15,
    };
    sizes[EWindow.XLARGE] = {
      min: 1200,
      max: undefined,
      containerWidth: "1170px",
      containerPadding: 15,
    };

    const responsive = () => {
      let rule = "";
      let meta = document.createElement("meta");

      document.head.appendChild(meta);

      meta.setAttribute("name", "viewport");
      meta.setAttribute("content", "width=device-width, initial-scale=1.0");

      forEach(sizeNames, (name, index) => {
        const strName = name.toString().match(/\w+\((\w+)\)/)[1];
        const size = sizes[name];
        let names = sizeNames.map(n => n);

        names.splice(index, 1);
        for (let col = 1; col <= 12; col++) {
          rule = `[${strName}-column="${col}"]`;
          for (let j = 0; j < sizeNames.length; j++) {
            const strNameJ = sizeNames[j].toString().match(/\w+\((\w+)\)/)[1];
            rule += `,[${strName}-column="${strNameJ}"][${strNameJ}-column="${col}"]`;
          }
          rule += `{width: ${(col * 100) / 12}%;}`;
          queries[name].insertRule(rule, queries[name].cssRules.length);
          
          rule = `[element-origin="Container"][hide-on-${strName}="true"] {display: none;}`;
          queries[name].insertRule(rule, queries[name].cssRules.length);
          
          rule = `[element-type="Container"][element-origin="Container"] {`;
          rule += `max-width: ${size.containerWidth};`;
          rule += "margin-left: auto;";
          rule += "margin-right: auto;";
          rule += `padding: var(--padding-v) ${size.containerPadding}px;`;
          rule += "display: block;}";
          queries[name].insertRule(rule, queries[name].cssRules.length);
        }
      });
    };

    const defineQueries = () => {
      forEach(sizeNames, name => {
        const size = sizes[name];
        let rule = "@media only screen";

        if (size.min) {
          rule += ` and (min-width: ${size.min}px)`;
        }
        if (size.max) {
          rule += ` and (max-width: ${size.max}px)`;
        }
        rule += " {}";

        queries[name] = styleElement.sheet.cssRules[styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length)];
      });
    };

    document.head.appendChild(styleElement);
    defineQueries();
    responsive();

    Object.defineProperty(this, "sizes", {
      get() {
        return sizeNames;
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
        get containerPadding() {
          return sizes[name].containerPadding;
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

          queries[name].conditionText = rule;
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

          queries[name].conditionText = rule;
        },
        set containerWidth(value) {
          sizes[name].containerWidth = value;

          // TODO Change queries containerWidths
        },
        set containerPadding(value) {
          sizes[name].containerPadding = value;

          // TODO Change queries containerPaddings
        },
        get query() {
          return queries[name];
        },
      };

      return result;
    };

    this.addQuery = (name, { min, max, containerWidth, containerPadding } = { containerWidth: "100%", containerPadding: 15}) => {
      let rule = "@media only screen";

      if (instanceOf(name, Symbol) && ((min === undefined) || instanceOf(min, Number)) && ((max === undefined) || instanceOf(max, Number)) && instanceOf(containerWidth, String) && instanceOf(containerPadding, Number)) {
        sizeNames.push(name);
        sizes[name] = {
          min,
          max,
          containerWidth,
          containerPadding,
        };

        if (min) {
          rule += ` and (min-width: ${min}px)`;
        }
        if (max) {
          rule += ` and (max-width: ${max}px)`;
        }
        rule += " {}";

        // TODO Callback an event to BStyle for adding this query to all of styles.

        queries[name] = styleElement.sheet.cssRules[styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length)];
      }
    }
  }
}

export const responsive = new Responsive();