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
    const styleSheet = styleElement.sheet;
    console.log(styleElement);
    const queries = {};
    const sizeNames = ["xsmall", "small", "medium", "large", "xlarge"];
    const sizes = {
      xsmall: {
        enum: EWindow.XSMALL,
        min: 1,
        max: 575.98,
        containerWidth: "100%",
        containerPadding: 0,
        styleSheetSection: undefined
      },
      small: {
        enum: EWindow.SMALL,
        min: 576,
        max: 767.98,
        containerWidth: "575px",
        containerPadding: 15,
        styleSheetSection: undefined
      },
      medium: {
        enum: EWindow.MEDIUM,
        min: 768,
        max: 991.98,
        containerWidth: "750px",
        containerPadding: 15,
        styleSheetSection: undefined
      },
      large: {
        enum: EWindow.LARGE,
        min: 992,
        max: 1199.98,
        containerWidth: "970px",
        containerPadding: 15,
        styleSheetSection: undefined
      },
      xlarge: {
        enum: EWindow.XLARGE,
        min: 1200,
        max: undefined,
        containerWidth: "1170px",
        containerPadding: 15,
        styleSheetSection: undefined
      }
    };

    const responsive = () => {
      let rule = "";
      let meta = document.createElement("meta");

      document.head.appendChild(meta);

      meta.setAttribute("name", "viewport");
      meta.setAttribute("content", "width=device-width, initial-scale=1.0");

      forEach(sizes, (size, index) => {
        let sizeNames = Object.keys(sizes);
        sizeNames.splice(index, 1);
        for (let col = 1; col <= 12; col++) {
          rule = `[${size.name}-column="${col}"]`;
          for (let j = 0; j < sizeNames.length; j++) {
            rule += `,[${size.name}-column="${sizeNames[j]}"][${sizeNames[j]}-column="${col}"]`;
          }
          rule += `{width: ${(col * 100) / 12}%;}`;
          queries[size.enum].insertRule(rule, mediaQueries[size.enum].cssRules.length);

          rule = `[element-origin="Container"][hide-on-${size.name}="true"] {display: none;}`;
          queries[size.enum].insertRule(rule, mediaQueries[size.enum].cssRules.length);

          rule = `[element-type="Container"][element-origin="Container"] {`;
          rule += `max-width: ${size.containerWidth};`;
          rule += "margin-left: auto;";
          rule += "margin-right: auto;";
          rule += `padding: var(--padding-v) ${size.containerPadding}px;`;
          rule += "display: block;}";
          queries[size.enum].insertRule(rule, mediaQueries[size.enum].cssRules.length);
        }
      });
    };

    const defineQueries = () => {
      forEach(sizes, (size) => {
        if (size.min) {
          queries[size.enum] = styleSheet.cssRules[styleSheet.insertRule(`@media only screen and (min-width: ${size.min}px) {}`, styleSheet.cssRules.length)];
        } else {
          queries[size.enum] = styleSheet.cssRules[styleSheet.insertRule(`@media only screen and (max-width: ${size.max}px) {}`, styleSheet.cssRules.length)];
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

    this.getSizeByName = (name) => {
      return sizes[name];
    }
  }
}

export const responsive = new Responsive();
export const responsiveSizes = responsive.sizes;