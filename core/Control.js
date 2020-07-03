import {
  instanceOf,
  forEach
} from "./Tigerian.js";
import {
  UI
} from "./UI.js";
import {
  responsiveSizes
} from "./Responsive.js";

/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */

("use strict");

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
    // this.setAttribute("element-type", "Control");
    this.setAttribute("element-name", "container");
    this.setAttribute("element-situation", "");
    this.setAttribute("element-hoverable", "false");

    this.setAttribute("xsmall-column", "small");
    this.setAttribute("small-column", "12");
    this.setAttribute("medium-column", "");
    this.setAttribute("large-column", "medium");
    this.setAttribute("xlarge-column", "medium");
    // this.setAttribute("hide-on-xsmall", "false");
    // this.setAttribute("hide-on-small", "false");
    // this.setAttribute("hide-on-medium", "false");
    // this.setAttribute("hide-on-large", "false");
    // this.setAttribute("hide-on-xlarge", "false");
    // this.setAttribute("float", "");
    // this.setAttribute("align", "");
    this.setAttribute("title", "");
    this.setAttribute("template-name", "");
    this.setAttribute("template-item", "");

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
        return that.getAttribute("title");
      },
      /**
       * @param {string} v
       */
      set(v) {
        that.setAttribute("title", v);
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
          that.getAttribute("tabindex") :
          0;
      },
      set(v) {
        if (instanceOf(v, "number")) {
          if (v > 0) {
            that.setAttribute("tabindex", v);
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

        forEach(responsiveSizes, (size, sizeName) => {
          Object.defineProperty(result, size.name, {
            enumerable: true,
            configurable: false,
            get() {
              return that.getAttribute(`${sizeName}-column`);
            },
            set(v) {
              if (instanceOf(v, Number)) {
                that.setAttribute(`${sizeName}-column`, v);
              } else if (instanceOf(v, Symbol)) {
                forEach(responsiveSizes, (s, sn) => {
                  if (v === s.name) {
                    that.setAttribute(`${sizeName}-column`, sn);
                  }
                });
              }
            }
          });
        });

        return result;
      },
      set(v) {
        if (instanceOf(v, Number)) {
          that.setAttribute("xsmall-column", "medium");
          that.setAttribute("small-column", "medium");
          that.setAttribute("medium-column", `${v}`);
          that.setAttribute("large-column", "medium");
          that.setAttribute("xlarge-column", "medium");
        } else {
          let vSizeName = "";
          forEach(responsiveSizes, (size, sizeName) => {
            if (size.name === v) {
              vSizeName = sizeName;
              let value = that.getAttribute(`${sizeName}-column`);
              if (parseInt(value) != value) {
                that.setAttribute(`${sizeName}-column`, 12);
              }
            }
          });

          forEach(responsiveSizes, (size, sizeName) => {
            if (size.name !== v) {
              that.setAttribute(`${sizeName}-column`, vSizeName);
            }
          });
        }
      }
    });

    /**
     * @member {string}
     */
    Object.defineProperty(this, "templateName", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {string}
       */
      get() {
        return that.getAttribute("template-name");
      },
      /**
       * @param {string} v
       */
      set(v) {
        that.setAttribute("template-name", v);
      }
    });

    /**
     * @member {string}
     */
    Object.defineProperty(this, "templateItem", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {string}
       */
      get() {
        return that.getAttribute("template-item");
      },
      /**
       * @param {string} v
       */
      set(v) {
        that.setAttribute("template-item", v);
        // elmDivContainer.style.gridArea = v;
      }
    });

    Object.defineProperty(this, "hoverable", {
      enumerable: true,
      configurable: true,
      get() {
        return that.getAttribute("element-hoverable") === "true";
      },
      set(v) {
        that.setAttribute("element-hoverable", v ? "true" : "false");
      }
    });

    Object.defineProperty(this, "situation", {
      enumerable: true,
      configurable: true,
      get() {
        let v = that.getAttribute("element-situation");

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
            that.setAttribute("element-situation", "title");
            break;

          case EControl.INFO:
            that.setAttribute("element-situation", "info");
            break;

          case EControl.DEFAULT:
            that.setAttribute("element-situation", "default");
            break;

          case EControl.TRANSPARENT:
            that.setAttribute("element-situation", "transparent");
            break;

          case EControl.OPPOSITE:
            that.setAttribute("element-situation", "opposite");
            break;

          case EControl.WARNING:
            that.setAttribute("element-situation", "warning");
            break;

          case EControl.ERROR:
            that.setAttribute("element-situation", "error");
            break;

          case EControl.OK:
            that.setAttribute("element-situation", "ok");
            break;

          case EControl.NONE:
          default:
            that.setAttribute("element-situation", "");
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