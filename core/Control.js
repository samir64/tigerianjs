import { BaseControl } from "./Tigerian.js";
import Router from "./Router.js";
import BWatch from "../behaviors/BWatch.js";
import BView from "../behaviors/BView.js";

const mergeTemplates = templates => {
  if (!Array.isArray(templates)) {
    templates = [templates];
  }

  return that => {
    const result = document.createElement("div");
    templates.forEach(t => {
      const tf = t(that);
      Array.from(tf.childNodes).forEach(child => {
        result.appendChild(child);
      })
    });
    return result;
  };
};

export const template = function (strings, ...keys) {
  return function (that) {
    const nodes = {};

    const result = [strings[0]];
    const el = document.createElement("div");
    const definedProperties = [];
    const defaults = {};

    keys.forEach((key, i) => {
      let value = "";

      if (!key["?"]) {
        if (key instanceof HTMLElement) {
          value = `<tg-replace-node name="${i}"></tg-replace-node>`;
        } else {
          value = key;
        }
      } else {
        value = `<tg-replace-node name="${i}"></tg-replace-node>`;
        keys[i] = key["?"];
      }

      result.push(value, strings[i + 1]);
    });

    el.innerHTML = result.join("");
    replaceNodes(el);

    return el;

    function replaceNodes(root) {
      Array.from(root.children).forEach(node => {
        replaceNodes(node);
      });

      if (root.tagName === "STYLE") {
        const re = /<tg-replace-node\s+name="([\w\.]+)"><\/tg-replace-node>/gm;
        const html = root.innerHTML;
        let lastIndex = 0;
        let nextNode;
        root.innerHTML = "";

        while ((nextNode = re.exec(html)) !== null) {
          console.log(nextNode);
          const nodeBefore = document.createTextNode(html.substr(lastIndex, nextNode.index));
          lastIndex = nextNode.index + nextNode[0].length;
          const nodeWatch = keys[nextNode[1]];
          root.appendChild(nodeBefore);
          root.appendChild(nodeWatch);
        }
        const nodeLast = document.createTextNode(html.substr(lastIndex));
        root.appendChild(nodeLast);
        console.log(root.childNodes);
      } else {
        const tgReplaceNodes = Array.from(root.children ?? []).filter(el => el.tagName === "TG-REPLACE-NODE");

        tgReplaceNodes.forEach(node => {
          const index = parseInt(node.getAttribute("name"));
          root.insertBefore(keys[index], node);
          root.removeChild(node);
        });
      }
    }
  };
};

const ElementControl = Ctrl => class extends HTMLElement {
  constructor() {
    super();

    new Ctrl(this);
  }

  connectedCallback(){
  }
};

export class Control extends BaseControl {
  #el;
  #loaded = false;
  #loadEvents = [];

  get template() {
    return template``;
  }

  get layout() {}

  get data() {
    return {};
  }

  mounted() {}

  #checkAttributes(els) {
    els.forEach(el => {
      const attrs = Array.from(el.attributes);
      const elControl = el.control ?? new BaseControl(el);

      elControl.baseUrl = this.baseUrl;

      attrs.forEach(({name, value}) => {
        switch (name[0]) {
        case "@":
          el.addEventListener(name.substr(1), this[value].bind(this));
          el.removeAttribute(name);
          // elControl[name] = this[value].bind(this);
          elControl.addEvent(name, this[value].bind(this));
          break;

        case ":":
          name = name.substr(1);

          switch (name) {
          case "class":
            Object.entries(this.data[value]).forEach(([className, val]) => {
              if (!!val) {
                el.classList.add(className);
              } else {
                el.classList.remove(className);
              }

              this.data[value]["@" + className] = v => {
                if (!!v.value) {
                  el.classList.add(className);
                } else {
                  el.classList.remove(className);
                }
              }
            });
            break;

          case "style":
            Object.entries(this.data[value]).forEach(([style, val]) => {
              el.style[style] = val;
              this.data[value]["@" + style] = v => {
                el.style[style] = v.value;
              }
            });
            break;

          default:
            switch (name) {
            // case "for":
            //   console.log("For", this.data[value]);
            //   break;

            // case "in":
            //   console.log("In", this.data[value]);
            //   break;

            case "if":
              elControl.visible = this.data[value];
              this.data["@" + value] = (v) => {
                elControl.visible = v.value;
              }
              // TODO: Bind element `visible` property to `value` variable of `this.data`
              break;

            default:
              elControl.data[name] = this.data[value];
              if (typeof this.data[value] === "string") {
                elControl.data["$" + name] = this.data[value];
              }
            }
          }

          el.removeAttribute(":" + name);
          break;

        default:
          elControl.data[name] = value;
        }
      });

      this.#checkAttributes(Array.from(el.children));
    });
  }

  #init() {
    let templateFormatter = mergeTemplates(this.template);
    const shadow = this.#el.shadowRoot ?? this.#el.attachShadow({ mode: "open" });

    customElements.whenDefined("tg-" + this.constructor.name.toKebabCase()).then(() => {
      const elementHtml = templateFormatter(this);

      Array.from(elementHtml.childNodes ?? []).forEach(node => {
        if (!!this.layout) {
          this.#el.appendChild(node);
        } else {
          shadow.appendChild(node);
        }
      });

      if (!!this.layout) {
        const elLayout = document.createElement("div");
        const ctrlLayout = new this.layout(elLayout);
        if (ctrlLayout instanceof Control) {
          ctrlLayout.onload = () => {
            shadow.appendChild(elLayout.shadowRoot);
          };
        };

        Object.defineProperty(this, "layout", {
          get() {
            return ctrlLayout;
          },
          enumerable: false,
          configurable: false,
        });
      }


      this.#checkAttributes(Array.from(this.#el.shadowRoot.children));

      this.mounted();
      this.#onload();
      this.#loaded = true;
    });
  }

  constructor(el) {
    const hasEl = !!el;

    if (!el) {
      el = document.createElement("div");
    }
    super(el);

    this.#el = el;

    el.setAttribute("tg-" + this.constructor.name.toKebabCase(), "");

    this.config(BWatch, this.data);
    this.config(BView);

    this.#init();
  }

  #onload() {
    this.#loadEvents.forEach(event => event());
  }

  set onload(v) {
    if (typeof v !== "function") {
      return;
    }

    this.#loadEvents.push(v);

    if (!!this.#loaded) {
      v();
    }
  }

  static create() {
    customElements.define("tg-" + this.name.toKebabCase(), ElementControl(this));
  }

  getTemplateById(id) {
    const elTemplate = document.body.querySelector("template#" + id);
    const result = eval(`template\`${elTemplate?.innerHTML ?? ""}\``);

    return result;
  }
}












// class Document extends BaseControl {
//   constructor() {
//     super(document.body);
//   }

//   get title() {
//     return document.title;
//   }

//   set title(v) {
//     document.title = v;
//   }
// }

// const doc = mainControl => {
//   const d = new Document();

//   d.append(mainControl);

//   return d;  
// }

// export { doc as Document };

















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