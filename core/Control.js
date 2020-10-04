import {
  instanceOf,
  forEach
} from "./Tigerian.js";
import {
  UI
} from "./UI.js";
import {
  responsive
} from "./Responsive.js";

/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */

"use strict";

/**
 * @param {string} [style = ""]
 * @param {Application|Control} [parent = undefined]
 *
 * @extends {Tigerian}
 * @constructor
 */
export class Control extends UI {
  /**
   * @param {UI} parent
   * @param {string} theme
   */
  constructor(parent, theme = "", htmlTag = "div") {
    let elmDivContainer = document.createElement(htmlTag);
    super(elmDivContainer, parent, theme);

    //NOTE Private Variables
    let that = this;
    let elmTxtHead = document.createTextNode("");
    let elmTxtFoot = document.createTextNode("");
    let superAddControl = this.addControl;

    //NOTE Append Elements
    elmDivContainer.appendChild(elmTxtHead);
    elmDivContainer.appendChild(elmTxtFoot);

    //NOTE Attributes
    this.attribute("situation", EControl, EControl.NONE);
    this.attribute("hoverable", Boolean, false);
    this.attribute("title", String, "");
    this.attribute("templateName", String, "");
    this.attribute("templateItem", String, "");

    this.elementName = "container";
    // this.dataset.xsmallColumn = 12;
    // this.dataset.smallColumn = "";
    // this.dataset.mediumColumn = "";
    // this.dataset.largeColumn = "";
    // this.dataset.xlargeColumn = "";

    //NOTE Properties
    /**
     * @member {string}
     */
    Object.defineProperty(this, "headText", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {string}
       */
      get() {
        return elmTxtHead.data;
      },
      /**
       * @param {string} v
       */
      set(v) {
        elmTxtHead.data = v;
      }
    });

    /**
     * @member {string}
     */
    Object.defineProperty(this, "footText", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {string}
       */
      get() {
        return elmTxtFoot.data;
      },
      /**
       * @param {string} v
       */
      set(v) {
        elmTxtFoot.data = v;
      }
    });

    /**
     * @member {string}
     */
    Object.defineProperty(this, "hint", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {string}
       */
      get() {
        return that.dataset.title;
      },
      /**
       * @param {string} v
       */
      set(v) {
        that.dataset.title = v;
      }
    });

    /**
     * @member {number}
     */
    Object.defineProperty(this, "tabIndex", {
      enumerable: true,
      configurable: true,
      get() {
        return that.hasAttribute("tabindex") ?
          that.dataset.tabindex :
          0;
      },
      set(v) {
        if (instanceOf(v, "number")) {
          if (v > 0) {
            that.dataset.tabindex = v;
          } else {
            that.removeAttribute("tabindex");
          }
        }
      }
    });

    Object.defineProperty(this, "column", {
      enumerable: true,
      configurable: true,
      get() {
        let result = {};

        forEach(responsive.sizes, sizeName => {
          const strName = sizeName.toString().match(/\w+\((\w+)\)/)[1];
          Object.defineProperty(result, sizeName, {
            enumerable: true,
            configurable: false,
            get() {
              return that.dataset(`${strName}-column`);
            },
            set(v) {
              if (instanceOf(v, Number)) {
                that.dataset[`${strName}-column`] = v;
              // } else if (instanceOf(v, Symbol)) {
              //   that.setAttribute(`${strName}-column`, v.toString().match(/\w+\((\w+)\)/)[1]);
              }
            }
          });
        });

        return result;
      },
      set(v) {
        if (instanceOf(v, Number)) {
          that.dataset.xsmallColumn = v;
          that.dataset.smallColumn = "";
          that.dataset.mediumColumn = "";
          that.dataset.largeColumn = "";
          that.dataset.xlargeColumn = "";
          // } else {
          //   forEach(responsive.sizes, sizeName => {
          //     const strName = sizeName.toString().match(/\w+\((\w+)\)/)[1];
          //     let value = that.getAttribute(`${strName}-column`);
          //     if (parseInt(value) != value) {
          //       that.setAttribute(`${strName}-column`, 12);
          //     }
          //   });

          //   forEach(responsive.sizes, sizeName => {
          //     const strName = sizeName.toString().match(/\w+\((\w+)\)/)[1];
          //     if (sizeName !== v) {
          //       that.setAttribute(`${strName}-column`, v.toString().match(/\w+\((\w+)\)/)[1]);
          //     }
          //   });
        }
      }
    });

    /**
     * @member {string}
     */
    // Object.defineProperty(this, "templateName", {
    //   enumerable: true,
    //   configurable: true,
    //   /**
    //    * @returns {string}
    //    */
    //   get() {
    //     return that.dataset.templateName;
    //   },
    //   /**
    //    * @param {string} v
    //    */
    //   set(v) {
    //     that.dataset.templateName = v;
    //   }
    // });

    /**
     * @member {string}
     */
    // Object.defineProperty(this, "templateItem", {
    //   enumerable: true,
    //   configurable: true,
    //   /**
    //    * @returns {string}
    //    */
    //   get() {
    //     return that.dataset.templateItem;
    //   },
    //   /**
    //    * @param {string} v
    //    */
    //   set(v) {
    //     that.dataset.templateItem = v;
    //     // elmDivContainer.style.gridArea = v;
    //   }
    // });

    // Object.defineProperty(this, "hoverable", {
    //   enumerable: true,
    //   configurable: true,
    //   get() {
    //     return that.dataset.elementHoverable === "true";
    //   },
    //   set(v) {
    //     that.dataset.elementHoverable = v;
    //   }
    // });

    Object.defineProperty(this, "situation", {
      enumerable: true,
      configurable: true,
      get() {
        let v = that.dataset.situation;

        switch (v) {
          case "title":
            return EControl.TITLE;

          case "info":
            return EControl.INFO;

          case "default":
            return EControl.DEFAULT;

          case "transparent":
            return EControl.TRANSPARENT;

          case "opposite":
            return EControl.OPPOSITE;

          case "warning":
            return EControl.WARNING;

          case "error":
            return EControl.ERROR;

          case "ok":
            return EControl.OK;

          default:
            return EControl.NONE;
        }
      },
      set(v) {
        switch (v) {
          case EControl.TITLE:
            that.dataset.situation = "title";
            break;

          case EControl.INFO:
            that.dataset.situation = "info";
            break;

          case EControl.DEFAULT:
            that.dataset.situation = "default";
            break;

          case EControl.TRANSPARENT:
            that.dataset.situation = "transparent";
            break;

          case EControl.OPPOSITE:
            that.dataset.situation = "opposite";
            break;

          case EControl.WARNING:
            that.dataset.situation = "warning";
            break;

          case EControl.ERROR:
            that.dataset.situation = "error";
            break;

          case EControl.OK:
            that.dataset.situation = "ok";
            break;

          case EControl.NONE:
          default:
            that.dataset.situation = "";
            break;
        }
      }
    });

    /**
     * @param {Text|Element|Control} control
     */
    this.addControl = (control) => {
      superAddControl(control);
      elmDivContainer.appendChild(elmTxtFoot);
    };

    this.clearContent = () => {
      elmDivContainer.innerHTML = "";
    };

    this.click = () => {
      elmDivContainer.click();
    };

    // this.focus = () => {
    //     elmDivContainer.focus();
    // };
  }
}

export const EControl = Object.freeze({
  // DIVISION: Symbol("div"),
  // PARAGRAPH: Symbol("p"),
  // SPAN: Symbol("span"),
  // SECTION: Symbol("section"),
  // ARTICLE: Symbol("article"),
  // HEADER: Symbol("header"),
  // FOOTER: Symbol("footer"),

  // LEFT: Symbol("left"),
  // RIGHT: Symbol("right"),
  // CENTER: Symbol("center"),
  // JUSTIFY: Symbol("justify"),

  NONE: Symbol("none"),
  DEFAULT: Symbol("default"),
  TITLE: Symbol("title"),
  INFO: Symbol("info"),
  TRANSPARENT: Symbol("transparent"),
  OPPOSITE: Symbol("opposite"),
  WARNING: Symbol("warning"),
  ERROR: Symbol("error"),
  OK: Symbol("ok")
});