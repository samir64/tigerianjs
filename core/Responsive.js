("use strict");

import {
  EWindow
} from "../behaviors/BWindow.js";
import {
  forEach,
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
    document.body.appendChild(styleElement);
    const styleSheet = styleElement.sheet;
    const queries = {};
    // const sizeNames = ["xsmall", "small", "medium", "large", "xlarge"];
    const sizeNames = [EWindow.XSMALL, EWindow.SMALL, EWindow.MEDIUM, EWindow.LARGE, EWindow.XLARGE];
    const sizes = {};

    sizes[EWindow.XSMALL] = {
      min: 1,
      max: 575.98,
      containerWidth: "100%",
      containerPadding: 0,
    };
    sizes[EWindow.SMALL] = {
      min: 576,
      max: 767.98,
      containerWidth: "575px",
      containerPadding: 15,
    };
    sizes[EWindow.MEDIUM] = {
      min: 768,
      max: 991.98,
      containerWidth: "750px",
      containerPadding: 15,
    };
    sizes[EWindow.LARGE] = {
      min: 992,
      max: 1199.98,
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
        // let sizeNames = Object.keys(sizes);

        names.splice(index, 1);
        for (let col = 1; col <= 12; col++) {
          rule = `[${strName}-column="${col}"]`;
          for (let j = 0; j < sizeNames.length; j++) {
            const strNameJ = sizeNames[j].toString().match(/\w+\((\w+)\)/)[1];
            rule += `,[${strName}-column="${strNameJ}"][${strNameJ}-column="${col}"]`;
          }
          rule += `{width: ${(col * 100) / 12}%;}`;
          styleSheet.insertRule(rule, styleSheet.cssRules.length);

          rule = `[element-origin="Container"][hide-on-${strName}="true"] {display: none;}`;
          styleSheet.insertRule(rule, styleSheet.cssRules.length);

          rule = `[element-type="Container"][element-origin="Container"] {`;
          rule += `max-width: ${size.containerWidth};`;
          rule += "margin-left: auto;";
          rule += "margin-right: auto;";
          rule += `padding: var(--padding-v) ${size.containerPadding}px;`;
          rule += "display: block;}";
          styleSheet.insertRule(rule, styleSheet.cssRules.length);
        }
      });
    };

    const defineQueries = () => {
      forEach(sizeNames, name => {
        const size = sizes[name];
        if (size.min) {
          queries[name] = styleSheet.cssRules[styleSheet.insertRule(`@media only screen and (min-width: ${size.min}px) {}`, styleSheet.cssRules.length)];
        } else {
          queries[name] = styleSheet.cssRules[styleSheet.insertRule(`@media only screen and (max-width: ${size.max}px) {}`, styleSheet.cssRules.length)];
        }
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
          return sizes[name].min = value;
        },
        set max(value) {
          return sizes[name].max = value;
        },
        set containerWidth(value) {
          return sizes[name].containerWidth = value;
        },
        set containerPadding(value) {
          return sizes[name].containerPadding = value;
        },
        get query() {
          return queries[name];
        },
      };

      return result;
    }
  }
}

export const responsive = new Responsive();