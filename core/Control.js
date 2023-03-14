import { BaseControl, loadTemplate, template } from "./Tigerian.js";
import Style from "./Style.js";

const mergeTemplates = templates => {
  if (!Array.isArray(templates)) {
    templates = [templates];
  }

  return that => {
    const result = document.createElement("div");
    templates.forEach(t => {
      const tf = t(that);
      Array.from(tf.children).forEach(child => {
        result.appendChild(child);
      })
    });
    return result;
  };
};

const ElementControl = Ctrl => class extends HTMLElement {
  #control;

  get control() {
    return this.#control;
  }

  connectedCallback() {
  }

  constructor() {
    super();
    const instance = new Ctrl(this);
    this.#control = instance;
  }
};

export class Control extends BaseControl {
  #el;

  get properties() {
    return {};
  }

  get template() {
    return template``;
  }

  get data() {
    return {};
  }

  mounted() {}

  #getAttributes() {
    const result = {};

    Object.entries(this.properties).forEach(([propName, propDesc]) => {
      const hasProp = this.#el.hasAttribute(propName);

      if (!hasProp) {
        result[propName] = propDesc.default;
      } else {
        const propValue = this.#el.getAttribute(propName);

        result[propName] = propValue;
      }
    });

    return result;
  }

  #checkAttributes(els) {
    els.forEach(el => {
      const attrs = Array.from(el.attributes);
  
      attrs.forEach(({name, value}) => {
        switch (name[0]) {
        case "@":
          el.addEventListener(name.substr(1), this[value].bind(this));
          break;

        case ":":
          switch (name.substr(1)) {
          case "class":
            console.log(name, value, this.data[value]);
            break;

          case "style":
            console.log(name, value, this.data[value]);
            break;

          default:
            if (!el.control) {
              el.control = new BaseControl(el);
            }
            el.control.prop.data[name.substr(1)] = this.data[value];
            el.removeAttribute(name);

            this.data.listener[value] = (v, n) => {
              el.control.prop.data[name.substr(1)] = v;
              // el.setAttribute(name.substr(1), v);
              console.log(el, el.control.prop.data[name.substr(1)], v);
            }
          }
          break;

        default:
        }
      });

      this.#checkAttributes(Array.from(el.children));
    });
  }

  #defineData() {
    const defs = this.data;
    const events = {};

    const listener = new Proxy(events, {
      set(target, name, value) {
        const result = (typeof value === "function");
        const eventExists = name in events;

        if (!!eventExists) {
          events[name].push(value);
        } else {
          events[name] = [value];
        }

        return result;
      }
    });

    const proxy = new Proxy(defs, {
      get(target, name) {
        switch(name) {
        case "listener":
          return listener;
          break;

        default:
          return target[name];
        }
      },
      set(target, name, value) {
        const cbs = events[name] ?? [];
        target[name] = value;
        cbs.forEach(cb => cb(value, name));
        return true;
      }
    });

    Object.defineProperty(this, "data", {
      get() {
        return proxy;
      },
      configurable: false,
      enumerable: false,
    });
  }

  async #init() {
    this.#defineData();
    let templateFormatter = mergeTemplates(this.template);
    // templateFormatter = await this.template;

    const shadow = this.#el.attachShadow({ mode: "open" });

    customElements.whenDefined("tg-" + this.constructor.name.toKebabCase()).then(() => {
      const elementHtml = templateFormatter(this);
      Array.from(elementHtml.childNodes ?? []).forEach(node => {
        shadow.appendChild(node);
      });

      this.#checkAttributes(Array.from(this.#el.shadowRoot.children));

      this.mounted();
      this?.onload?.();
    });
  }

  constructor(el) {
    if (!el) {
      el = document.createElement("div");
    }
    super(el);

    this.#el = el;

    el.setAttribute("tg-" + this.constructor.name.toKebabCase(), "");

    this.#init();
  }

  get defTemplate() {
    return template.bind(this);
  }

  static create() {
    customElements.define("tg-" + this.name.toKebabCase(), ElementControl(this));
  }
}

class Document extends BaseControl {
  constructor() {
    super(document.body);
  }

  get title() {
    return document.title;
  }

  set title(v) {
    document.title = v;
  }
}

const doc = mainControl => {
  const d = new Document();

  d.append(mainControl);

  return d;  
}

export { doc as Document };

















// // import {
// //   instanceOf,
// //   forEach
// // } from "./Tigerian.js";
// import {
//   UI
// } from "./UI.js";
// import {
//   responsive
// } from "./Responsive.js";
// // import {
// //   ESituation
// // } from "./Theme.js";

// /**
//  * Created by samir on 8/25/16.
//  * Version 1.0.0.100
//  */

// /**
//  * @param {string} [style = ""]
//  * @param {Application|Control} [parent = undefined]
//  *
//  * @extends {UI}
//  * @constructor
//  */
// export class Control extends UI {
//   /**
//    * @param {UI} parent

//    */
//   constructor(parent, htmlTag = "div") {
//     let elmDivContainer = document.createElement(htmlTag);
//     super(elmDivContainer, parent);

//     //NOTE Private Variables
//     let that = this;
//     let elmTxtHead = document.createTextNode("");
//     let elmTxtFoot = document.createTextNode("");
//     let superAddControl = this.addControl;

//     //NOTE Append Elements
//     elmDivContainer.appendChild(elmTxtHead);
//     elmDivContainer.appendChild(elmTxtFoot);

//     //NOTE Attributes
//     // this.attribute("situation", ESituation, ESituation.NONE);
//     this.attribute("hoverable", Boolean, false);
//     this.attribute("title", String, "");
//     this.attribute("templateName", String, "");
//     this.attribute("templateItem", String, "");

//     this.elementName = "container";
//     // this.dataset.xsmallColumn = 12;
//     // this.dataset.smallColumn = "";
//     // this.dataset.mediumColumn = "";
//     // this.dataset.largeColumn = "";
//     // this.dataset.xlargeColumn = "";

//     //NOTE Properties
//     /**
//      * @member {string}
//      */
//     Object.defineProperty(this, "headText", {
//       enumerable: true,
//       configurable: true,
//       /**
//        * @returns {string}
//        */
//       get() {
//         return elmTxtHead.data;
//       },
//       /**
//        * @param {string} v
//        */
//       set(v) {
//         elmTxtHead.data = v;
//       }
//     });

//     /**
//      * @member {string}
//      */
//     Object.defineProperty(this, "footText", {
//       enumerable: true,
//       configurable: true,
//       /**
//        * @returns {string}
//        */
//       get() {
//         return elmTxtFoot.data;
//       },
//       /**
//        * @param {string} v
//        */
//       set(v) {
//         elmTxtFoot.data = v;
//       }
//     });

//     /**
//      * @member {string}
//      */
//     Object.defineProperty(this, "hint", {
//       enumerable: true,
//       configurable: true,
//       /**
//        * @returns {string}
//        */
//       get() {
//         return that.dataset.title;
//       },
//       /**
//        * @param {string} v
//        */
//       set(v) {
//         that.dataset.title = v;
//       }
//     });

//     /**
//      * @member {number}
//      */
//     Object.defineProperty(this, "tabIndex", {
//       enumerable: true,
//       configurable: true,
//       get() {
//         return that.hasAttribute("tabindex") ?
//           that.dataset.tabindex :
//           0;
//       },
//       set(v) {
//         if (instanceOf(v, "number")) {
//           if (v > 0) {
//             that.dataset.tabindex = v;
//           } else {
//             that.removeAttribute("tabindex");
//           }
//         }
//       }
//     });

//     Object.defineProperty(this, "column", {
//       enumerable: true,
//       configurable: true,
//       get() {
//         let result = {};

//         forEach(responsive.sizes, sizeName => {
//           const strName = sizeName.toString().match(/\w+\((\w+)\)/)[1];
//           Object.defineProperty(result, sizeName, {
//             enumerable: true,
//             configurable: false,
//             get() {
//               return that.dataset(`${strName}-column`);
//             },
//             set(v) {
//               if (instanceOf(v, Number)) {
//                 that.dataset[`${strName}-column`] = v;
//                 // } else if (instanceOf(v, Symbol)) {
//                 //   that.setAttribute(`${strName}-column`, v.toString().match(/\w+\((\w+)\)/)[1]);
//               }
//             }
//           });
//         });

//         return result;
//       },
//       set(v) {
//         if (instanceOf(v, Number)) {
//           that.dataset.xsmallColumn = v;
//           that.dataset.smallColumn = "";
//           that.dataset.mediumColumn = "";
//           that.dataset.largeColumn = "";
//           that.dataset.xlargeColumn = "";
//           // } else {
//           //   forEach(responsive.sizes, sizeName => {
//           //     const strName = sizeName.toString().match(/\w+\((\w+)\)/)[1];
//           //     let value = that.getAttribute(`${strName}-column`);
//           //     if (parseInt(value) != value) {
//           //       that.setAttribute(`${strName}-column`, 12);
//           //     }
//           //   });

//           //   forEach(responsive.sizes, sizeName => {
//           //     const strName = sizeName.toString().match(/\w+\((\w+)\)/)[1];
//           //     if (sizeName !== v) {
//           //       that.setAttribute(`${strName}-column`, v.toString().match(/\w+\((\w+)\)/)[1]);
//           //     }
//           //   });
//         }
//       }
//     });

//     /**
//      * @member {string}
//      */
//     // Object.defineProperty(this, "templateName", {
//     //   enumerable: true,
//     //   configurable: true,
//     //   /**
//     //    * @returns {string}
//     //    */
//     //   get() {
//     //     return that.dataset.templateName;
//     //   },
//     //   /**
//     //    * @param {string} v
//     //    */
//     //   set(v) {
//     //     that.dataset.templateName = v;
//     //   }
//     // });

//     /**
//      * @member {string}
//      */
//     // Object.defineProperty(this, "templateItem", {
//     //   enumerable: true,
//     //   configurable: true,
//     //   /**
//     //    * @returns {string}
//     //    */
//     //   get() {
//     //     return that.dataset.templateItem;
//     //   },
//     //   /**
//     //    * @param {string} v
//     //    */
//     //   set(v) {
//     //     that.dataset.templateItem = v;
//     //     // elmDivContainer.style.gridArea = v;
//     //   }
//     // });

//     // Object.defineProperty(this, "hoverable", {
//     //   enumerable: true,
//     //   configurable: true,
//     //   get() {
//     //     return that.dataset.elementHoverable === "true";
//     //   },
//     //   set(v) {
//     //     that.dataset.elementHoverable = v;
//     //   }
//     // });

//     // Object.defineProperty(this, "situation", {
//     //   enumerable: true,
//     //   configurable: true,
//     //   get() {
//     //     let v = that.dataset.situation;

//     //     switch (v) {
//     //       case "title":
//     //         return EControl.TITLE;

//     //       case "info":
//     //         return EControl.INFO;

//     //       case "default":
//     //         return EControl.DEFAULT;

//     //       case "transparent":
//     //         return EControl.TRANSPARENT;

//     //       case "opposite":
//     //         return EControl.OPPOSITE;

//     //       case "warning":
//     //         return EControl.WARNING;

//     //       case "error":
//     //         return EControl.ERROR;

//     //       case "ok":
//     //         return EControl.OK;

//     //       default:
//     //         return EControl.NONE;
//     //     }
//     //   },
//     //   set(v) {
//     //     switch (v) {
//     //       case EControl.TITLE:
//     //         that.dataset.situation = "title";
//     //         break;

//     //       case EControl.INFO:
//     //         that.dataset.situation = "info";
//     //         break;

//     //       case EControl.DEFAULT:
//     //         that.dataset.situation = "default";
//     //         break;

//     //       case EControl.TRANSPARENT:
//     //         that.dataset.situation = "transparent";
//     //         break;

//     //       case EControl.OPPOSITE:
//     //         that.dataset.situation = "opposite";
//     //         break;

//     //       case EControl.WARNING:
//     //         that.dataset.situation = "warning";
//     //         break;

//     //       case EControl.ERROR:
//     //         that.dataset.situation = "error";
//     //         break;

//     //       case EControl.OK:
//     //         that.dataset.situation = "ok";
//     //         break;

//     //       case EControl.NONE:
//     //       default:
//     //         that.dataset.situation = "";
//     //         break;
//     //     }
//     //   }
//     // });

//     /**
//      * @param {Text|Element|Control} control
//      */
//     this.addControl = (control) => {
//       superAddControl(control);
//       elmDivContainer.appendChild(elmTxtFoot);
//     };

//     this.clearContent = () => {
//       elmDivContainer.innerHTML = "";
//     };

//     this.click = () => {
//       elmDivContainer.click();
//     };

//     // this.focus = () => {
//     //     elmDivContainer.focus();
//     // };
//   }
// }

// export const EControl = Object.freeze({
//   NONE: Symbol("none"),
//   DEFAULT: Symbol("default"),
//   TITLE: Symbol("title"),
//   INFO: Symbol("info"),
//   TRANSPARENT: Symbol("transparent"),
//   OPPOSITE: Symbol("opposite"),
//   WARNING: Symbol("warning"),
//   ERROR: Symbol("error"),
//   OK: Symbol("ok")
// });