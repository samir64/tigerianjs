import { Tigerian, loadTemplate, template } from "./Tigerian.js";
import BWatch from "../behaviors/BWatch.js";

export class BaseControl extends Tigerian {
  #el;
  #observerReducer = (res, cur) => ({...res, [cur.attributeName]: cur.target.getAttribute(cur.attributeName)});
  #attributeListeners = [];
  #elementObserver = p => this.#attributeListeners.forEach(attributeListener => attributeListener(p.reduce(this.#observerReducer, {})));

  constructor(el) {
    super();

    this.#el = el;

    const observer = new MutationObserver(this.#elementObserver);
    observer.observe(el, { attributes: true, });

    this.config(BWatch);
  }

  set attributeListener(v) {
    if (typeof v === "function") {
      this.#attributeListeners.push(v);
    }
  }

  removeAttributeListener(v) {
    this.#attributeListeners = this.#attributeListeners.filter(attributeListener => attributeListener !== v);
  }

  getControl(query) {
    let result;

    const el = this.#el?.shadowRoot ?? this.#el;
    const nodes = Array.from(el.childNodes);

    if (Number.isInteger(query)) {
      result = nodes[query];
    } else {
      result = el.querySelector(query);
    }

    if (result?.nodeName === "#text") {
      return new Text(result);
    }

    return !result ? undefined : (result.control ?? new BaseControl(result));
  }

  getControls(query) {
    let result;
    const el = this.#el?.shadowRoot ?? this.#el;
    const nodes = Array.from(el.childNodes);

    result = Array.from(el.querySelectorAll(query));

    return (result ?? []).map(node => {
      if (node.nodeName === "#text") {
        return new Text(node);
      }
      return !node ? undefined : (node.control ?? new BaseControl(node));
    });
  }

  appendTo(parentElement, index) {
    if (index < 0) {
      index = this.#el.children.length + index;
    }
    parentElement.insertBefore(this.#el, Number.isInteger(index) ? parentElement.children[index] : null);
  }

  append(control, index) {
    if (index < 0) {
      index = this.#el.children.length + index;
    }

    if (control instanceof BaseControl) {
      control.appendTo(this.#el, index);
    } else {
      this.#el.insertBefore(control.#el, Number.isInteger(index) ? this.#el.children[index] : null);
    }
  }

  get prop() {
    const data = new Proxy(this.#el.dataset, {
      get(target, name) {
        const result = target[name];
        return result;
      },
      set(target, name, value) {
        target[name] = value;
        return true;
      },
    });

    const result = new Proxy(this.#el, {
      get(target, name) {
        if (name !== "data") {
          return target.getAttribute(name);
        } else {
          return data;
        }
      },
      set(target, name, value) {
        target.setAttribute(name, value);
        return true;
      },
    });

    return result;
  }
}

const ElementControl = Ctrl => class extends HTMLElement {
  #control;

  get control() {
    return this.#control;
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
        if (name[0] === "@") {
          el.addEventListener(name.substr(1), eval("this." + value + ".bind(this)"));
        }
      });

      this.#checkAttributes(Array.from(el.children));
    });
  }

  async #init() {
    const templateFormatter = await this.template;
    const elementHtml = templateFormatter(this, this.#el.attributes);
    // const elementHtml = templateFormatter(this, this.#getAttributes());

    //this.#el.attachShadow({ mode: "open" }).innerHTML = elementHtml;
    const shadow = this.#el.attachShadow({ mode: "open" });
    Array.from(elementHtml.childNodes).forEach(node => {
      shadow.appendChild(node);
    });

    this.#checkAttributes(Array.from(this.#el.shadowRoot.children));

    customElements.whenDefined("tg-" + this.constructor.name.toKebabCase()).then(() => {
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
    
    this.#init();
  }

  static create() {
    customElements.define("tg-" + this.name.toKebabCase(), ElementControl(this));
  }
}

export class Text extends BaseControl {
  #node;
  constructor(node) {
    super(node);
    this.#node = node ?? document.createTextNode("");
  }

  get text() {
    return this.#node.data;
  }

  set text(value) {
    this.#node.data = value;
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