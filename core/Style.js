// import { Text } from "./Tigerian.js";
// import { Text } from "./Control.js";
import { Text, BaseControl } from "./Tigerian.js";

export default class Style extends BaseControl {
  #breakpoints = {};
  #el;
  #queries = {};

  constructor() {
    const elStyle = document.createElement("style");
    super(elStyle);
    this.#el = elStyle;

    const breakpoints = {
      "XSMALL" : {
        min: 0,
        max: 0,
        containerWidth: "100%",
        gutter: 16,
        columnPadding: "0 16px",
        containerMargin: "0 16px",
      },
      "SMALL" : {
        min: 0,
        max: 0,
        containerWidth: "100%",
        gutter: 16,
        columnPadding: "0 16px",
        containerMargin: "0 16px",
      },
      "MEDIUM" : {
        min: 0,
        max: 0,
        containerWidth: "100%",
        gutter: 16,
        columnPadding: "0 16px",
        containerMargin: "0 16px",
      },
      "LARGE" : {
        min: 0,
        max: 0,
        containerWidth: "100%",
        gutter: 16,
        columnPadding: "0 16px",
        containerMargin: "0 16px",
      },
      "XLARGE" : {
        min: 0,
        max: 0,
        containerWidth: "100%",
        gutter: 16,
        columnPadding: "0 16px",
        containerMargin: "0 16px",
      },
      "XXLARGE" : {
        min: 0,
        max: 0,
        containerWidth: "100%",
        gutter: 16,
        columnPadding: "0 16px",
        containerMargin: "0 16px",
      },
    };

    Object.entries(breakpoints).forEach(([name, options]) => {
      this.addNewBreakpoint(name, options);
    });
  }

  get breakpoints() {
    return this.#breakpoints;
  }

  addNewBreakpoint(name, {
    min,
    max,
    containerWidth,
    containerMargin,
    gutter,
    columnPadding,
  }) {
    this.#breakpoints[name] = {
      min,
      max,
      containerWidth,
      containerMargin,
      gutter,
      columnPadding,
    };

    if (name in this.#queries) {

    } else {
      const query = new Text();
      const condMin = new Text();
      const condMax = new Text();
      const open = new Text();
      const containerWidth = new Text();
      const containerMargin = new Text();
      const gutter = new Text();
      const columnPadding = new Text();
      const close = new Text();

      const breakpoint = this.#breakpoints[name];
      query.text = "@media only screen";

      if (!!breakpoint.min) {
        condMin.text = `and (min-width: ${breakpoint.min}px)`;
      }
      if (!!breakpoint.max) {
        condMax.text = `and (max-width: ${breakpoint.max}px)`;
      }
      open.text = "{";
      containerWidth.text = `${breakpoint.containerWidth}`;
      containerMargin.text = `${breakpoint.containerWidth}`;
      gutter.text = `${breakpoint.gutter}`;
      columnPadding.text = `${breakpoint.columnPadding}`;
      close.text = "}";

      // breakpoint.query.index = styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length);
      // breakpoint.query.rule = styleElement.sheet.cssRules[size.query.index];

      this.append(query);
      this.append(condMin);
      this.append(condMax);
      this.append(open);
      this.append(containerWidth);
      this.append(containerMargin);
      this.append(gutter);
      this.append(columnPadding);
      this.append(close);


      setTimeout(() => {
        containerWidth.text = "width: 500px;";
      }, 15000);
    }
  }

  removeBreakpoint(name) {
    delete this.#breakpoints[name];
  }
}





// import {
//   BEvent
// } from "../behaviors/BEvent.js";
// import {
//   Events
// } from "./Events.js";
// // import {
// //   EWindow
// // } from "../behaviors/BWindow.js";
// import {
//   // forEach,
//   // instanceOf,
//   Tigerian
// } from "./Tigerian.js";

// let instance;

// /**
//  * @class
//  * @extends Tigerian
//  * @extends BEvent
//  */
// class Responsive extends Tigerian {
//   constructor() {
//     if (instance) {
//       return instance;
//     }

//     super();
//     this.config(BEvent, window);

//     instance = this;

//     let root;
//     const styleElement = document.createElement("style");
//     document.head.appendChild(styleElement);
//     // const queries = {};
//     // const containerRules = {};
//     // const sizeNames = ["xsmall", "small", "medium", "large", "xlarge"];
//     // const sizeNames = [EResponsive.XSMALL, EResponsive.SMALL, EResponsive.MEDIUM, EResponsive.LARGE, EResponsive.XLARGE];
//     const sizes = {
//       names: [EResponsive.XSMALL, EResponsive.SMALL, EResponsive.MEDIUM, EResponsive.LARGE, EResponsive.XLARGE],
//     };

//     sizes[EResponsive.XSMALL] = {
//       min: undefined,
//       max: undefined,
//       containerWidth: "100%",
//       gutter: 0,
//       query: {},
//       containerStyle: undefined,
//     };
//     sizes[EResponsive.SMALL] = {
//       min: 576,
//       max: undefined,
//       containerWidth: "540px",
//       gutter: 0,
//       query: {},
//       containerStyle: undefined,
//     };
//     sizes[EResponsive.MEDIUM] = {
//       min: 768,
//       max: undefined,
//       containerWidth: "720px",
//       gutter: 30,
//       query: {},
//       containerStyle: undefined,
//     };
//     sizes[EResponsive.LARGE] = {
//       min: 992,
//       max: undefined,
//       containerWidth: "960px",
//       gutter: 30,
//       query: {},
//       containerStyle: undefined,
//     };
//     sizes[EResponsive.XLARGE] = {
//       min: 1200,
//       max: undefined,
//       containerWidth: "1140px",
//       gutter: 30,
//       query: {},
//       containerStyle: undefined,
//     };

//     const writeContainerStyle = name => {
//       let rule = "";
//       const size = sizes[name];

//       rule = `[data-element-type="Container"][data-element-origin="Container"] {`;
//       rule += `--gutter: ${size.gutter}px;`;
//       rule += `max-width: calc(${size.containerWidth} - var(--gutter));`;
//       rule += "margin-left: auto;";
//       rule += "margin-right: auto;";
//       rule += "display: flex;";
//       rule += "flex-wrap: wrap;";
//       rule += "justify-content: space-between;";
//       rule += "padding: calc(var(--gutter) / 2);";
//       rule += "}";
//       size.containerStyle = size.query.rule.cssRules[size.query.rule.insertRule(rule, size.query.rule.cssRules.length)].style;

//       rule = `[data-element-type="Container"][data-element-origin="Container"] [data-element-type="ContainerRow"][data-element-origin="Container"] {`;
//       rule += `width: calc(100% + var(--gutter));`;
//       rule += "display: flex;";
//       rule += "flex-wrap: wrap;";
//       rule += `margin: 0 calc(-1 * var(--gutter) / 2);`;
//       rule += "}";
//       size.query.rule.insertRule(rule, size.query.rule.cssRules.length);

//       rule = `[data-element-type="Container"] [data-element-type="ContainerRow"]>[data-element-type="ContainerColumn"][data-element-origin="Container"] {`;
//       rule += `flex: 0 0 calc(var(--column) * 100% / var(--column-count));`;
//       rule += `padding: 0 calc(var(--gutter) / 2);`;
//       rule += "display: flex;";
//       rule += "flex-direction: column;";
//       rule += "}";
//       size.query.rule.insertRule(rule, size.query.rule.cssRules.length);
//     }

//     const responsive = () => {
//       let meta = document.createElement("meta");

//       document.head.appendChild(meta);

//       meta.setAttribute("name", "viewport");
//       meta.setAttribute("content", "width=device-width, initial-scale=1.0");

//       let rule = '[data-element-type="Application"][data-element-origin="Container"][data-element-name="container"], [data-element-type="Application"][data-element-origin="Container"][data-element-name="container"] *{';
//       rule += "box-sizing: border-box;";
//       rule += "}";
//       styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length);

//       forEach(sizes.names, name => {
//         writeContainerStyle(name);
//       });
//     };

//     const defineQueries = () => {
//       forEach(sizes.names, name => {
//         const size = sizes[name];
//         let rule = "@media only screen";

//         if (size.min) {
//           rule += ` and (min-width: ${size.min}px)`;
//         }
//         if (size.max) {
//           rule += ` and (max-width: ${size.max}px)`;
//         }
//         rule += " {}";

//         size.query.index = styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length);
//         size.query.rule = styleElement.sheet.cssRules[size.query.index];
//       });
//     };

//     document.head.appendChild(styleElement);

//     root = styleElement.sheet.insertRule(":root{}", 0);
//     defineQueries();
//     responsive();

//     Object.defineProperty(this, "root", {
//       enumerable: true,
//       configurable: false,
//       get() {
//         return styleElement.sheet.cssRules[root];
//       },
//     });

//     Object.defineProperty(this, "sizes", {
//       get() {
//         return sizes.names;
//       },
//       enumerable: true,
//       configurable: true
//     });

//     this.size = name => {
//       let result = {
//         get min() {
//           return sizes[name].min;
//         },
//         get max() {
//           return sizes[name].max;
//         },
//         get containerWidth() {
//           return sizes[name].containerWidth;
//         },
//         get gutter() {
//           return sizes[name].gutter;
//         },
//         get query() {
//           if (sizes.names.indexOf(name) >= 0) {
//             return sizes[name].query.rule
//           }
//         },
//         // NOTE I removed 'set' for 'min' and 'max' because after editing these values we have to resort queries.
//         // set min(value) {
//         //   sizes[name].min = value;
//         //   let rule = "only screen";

//         //   if (value) {
//         //     rule += ` and (min-width: ${value}px)`;
//         //   }
//         //   if (sizes[name].max) {
//         //     rule += ` and (max-width: ${sizes[name].max}px)`;
//         //   }

//         //   sizes[name].query.rule.conditionText = rule;
//         // },
//         // set max(value) {
//         //   sizes[name].max = value;
//         //   let rule = "only screen";

//         //   if (sizes[name].min) {
//         //     rule += ` and (min-width: ${sizes[name].min}px)`;
//         //   }
//         //   if (value) {
//         //     rule += ` and (max-width: ${value}px)`;
//         //   }

//         //   sizes[name].query.conditionText = rule;
//         // },
//         set containerWidth(value) {
//           sizes[name].containerWidth = value;
//           sizes[name].containerStyle.maxWidth = value;
//         },
//         set gutter(value) {
//           sizes[name].gutter = value;
//           sizes[name].containerStyle.setProperty("--gutter", `${value}px`);
//         },
//       };

//       return result;
//     };

//     this.addQuery = (name, {
//       min,
//       max,
//       containerWidth,
//     }) => {
//       let rule = "@media only screen";

//       if (instanceOf(name, Symbol) && ((min === undefined) || instanceOf(min, Number)) && ((max === undefined) || instanceOf(max, Number)) && instanceOf(containerWidth, String)) {
//         sizes[name] = {
//           min,
//           max,
//           containerWidth,
//           containerStyle: {},
//           query: {},
//         };

//         let size = sizes[name];
//         let index = 0;
//         let i = 0;
//         const strName = name.toString().match(/\w+\((\w+)\)/)[1];

//         if (min) {
//           rule += ` and (min-width: ${min}px)`;
//         }
//         if (max) {
//           rule += ` and (max-width: ${max}px)`;
//         }
//         rule += " {}";

//         while ((i < sizes.names.length)) {
//           if ((sizes[sizes.names[i]].min === undefined) || (sizes[sizes.names[i]].min < min)) {
//             index = i;
//           } else {
//             sizes[sizes.names[i]].query.index++;
//           }
//           i++;
//         }

//         size.query.index = styleElement.sheet.insertRule(rule, sizes[sizes.names[index]].query.index + 1);
//         size.query.rule = styleElement.sheet.cssRules[size.query.index];
//         sizes.names.splice(index + 1, 0, name);

//         writeContainerStyle(name);

//         this.dispatchEvent(Events.onMediaQueryAdd, name);
//       }
//     }

//     this.removeQuery = name => {
//       if (name !== EResponsive.XSMALL) {
//         let size = sizes[name];
//         styleElement.sheet.removeRule(size.query.index);
//         sizes.names.splice(sizes.names.indexOf(name), 1);
//         delete sizes[name];

//         this.dispatchEvent(Events.onMediaQueryRemove, name);
//       } else {
//         throw new Error("XSmall size is not removable");
//       }
//     };
//   }
// }

// export const EResponsive = Object.freeze({
//   INLINE: Symbol("inline"),
//   XSMALL: Symbol("xsmall"),
//   SMALL: Symbol("small"),
//   MEDIUM: Symbol("medium"),
//   LARGE: Symbol("large"),
//   XLARGE: Symbol("xlarge"),
// });

// export const responsive = new Responsive();