import {
  instanceOf
} from "./Tigerian.js";
import {
  EWindow
} from "../behaviors/BWindow.js";
import {
  UI
} from "./UI.js";


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
  constructor(parent, theme = "") {
    var elmDivContainer = document.createElement("div");
    super(elmDivContainer, parent, theme);

    //NOTE Private Variables
    var that = this;
    var elmTxtHead = document.createTextNode("");
    var elmTxtFoot = document.createTextNode("");
    var superAddControl = this.addControl;


    //NOTE Append Elements
    elmDivContainer.appendChild(elmTxtHead);
    elmDivContainer.appendChild(elmTxtFoot);


    //NOTE Attributes
    this.setAttribute("element-type", "Control");
    this.setAttribute("element-name", "container");
    this.setAttribute("element-situation", "");
    this.setAttribute("element-hoverable", "false");

    this.setAttribute("small-column", "normal");
    this.setAttribute("medium-column", "normal");
    this.setAttribute("normal-column", "12");
    this.setAttribute("large-column", "normal");
    this.setAttribute("xlarge-column", "normal");
    this.setAttribute("hide-on-small", "false");
    this.setAttribute("hide-on-medium", "false");
    this.setAttribute("hide-on-normal", "false");
    this.setAttribute("hide-on-large", "false");
    this.setAttribute("hide-on-xlarge", "false");
    this.setAttribute("float", "");
    this.setAttribute("align", "");
    this.setAttribute("title", "");
    this.setAttribute("template-name", "");
    this.setAttribute("template-item", "");

    //NOTE Properties
    /**
     * @member {string}
     */
    this.defineProperty("headText", {
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
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("footText", {
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
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("title", {
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
      },
      type: String
    });

    /**
     * @member {number}
     */
    this.defineProperty("tabIndex", {
      get() {
        return that.hasAttribute("tabindex") ? that.getAttribute("tabindex") : 0;
      },
      set(v) {
        if (instanceOf(v, "number")) {
          if (v > 0) {
            that.setAttribute("tabindex", v);
          } else {
            that.removeAttribute("tabindex");
          }
        }
      },
      type: Number
    });

    /**
     * @member {number|symbol}
     */
    this.defineProperty("smallColumn", {
      /**
       * @returns {string}
       */
      get() {
        var v = that.getAttribute("small-column");
        switch (v) {
          case "":
            return EWindow.NONE;
            break;

          case "medium":
            return EWindow.SMALL;
            break;

          case "normal":
            return EWindow.MEDIUM;
            break;

          case "large":
            return EWindow.LARGE;
            break;

          case "xlarge":
            return EWindow.XLARGE;
            break;

          default:
            v = parseInt(v, 12);
            return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
        }
      },
      /**
       * @param {string} v
       */
      set(v) {
        switch (v) {
          case EWindow.NONE:
            that.setAttribute("small-column", "");
            break;

          case EWindow.SMALL:
            that.setAttribute("small-column", "medium");
            break;

          case EWindow.MEDIUM:
            that.setAttribute("small-column", "normal");
            break;

          case EWindow.LARGE:
            that.setAttribute("small-column", "large");
            break;

          case EWindow.XLARGE:
            that.setAttribute("small-column", "xlarge");
            break;

          default:
            if (instanceOf(v, "number")) {
              that.setAttribute("small-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
            }
        }
      },
      type: [Number, Symbol]
    });

    /**
     * @member {number|symbol}
     */
    this.defineProperty("mediumColumn", {
      /**
       * @returns {string}
       */
      get() {
        var v = that.getAttribute("medium-column");
        switch (v) {
          case "":
            return EWindow.NONE;
            break;

          case "small":
            return EWindow.XSMALL;
            break;

          case "normal":
            return EWindow.MEDIUM;
            break;

          case "large":
            return EWindow.LARGE;
            break;

          case "xlarge":
            return EWindow.XLARGE;
            break;

          default:
            v = parseInt(v, 12);
            return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
        }
      },
      /**
       * @param {string} v
       */
      set(v) {
        switch (v) {
          case EWindow.NONE:
            that.setAttribute("medium-column", "");
            break;

          case EWindow.XSMALL:
            that.setAttribute("medium-column", "small");
            break;

          case EWindow.MEDIUM:
            that.setAttribute("medium-column", "normal");
            break;

          case EWindow.LARGE:
            that.setAttribute("medium-column", "large");
            break;

          case EWindow.XLARGE:
            that.setAttribute("medium-column", "xlarge");
            break;

          default:
            if (instanceOf(v, "number")) {
              that.setAttribute("medium-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
            }
        }
      },
      type: [Number, Symbol]
    });

    /**
     * @member {number|symbol}
     */
    this.defineProperty("normalColumn", {
      /**
       * @returns {string}
       */
      get() {
        var v = that.getAttribute("normal-column");
        switch (v) {
          case "":
            return EWindow.NONE;
            break;

          case "small":
            return EWindow.XSMALL;
            break;

          case "medium":
            return EWindow.SMALL;
            break;

          case "large":
            return EWindow.LARGE;
            break;

          case "xlarge":
            return EWindow.XLARGE;
            break;

          default:
            v = parseInt(v, 12);
            return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
        }
      },
      /**
       * @param {string} v
       */
      set(v) {
        switch (v) {
          case EWindow.NONE:
            that.setAttribute("normal-column", "");
            break;

          case EWindow.XSMALL:
            that.setAttribute("normal-column", "small");
            break;

          case EWindow.SMALL:
            that.setAttribute("normal-column", "medium");
            break;

          case EWindow.LARGE:
            that.setAttribute("normal-column", "large");
            break;

          case EWindow.XLARGE:
            that.setAttribute("normal-column", "xlarge");
            break;

          default:
            if (instanceOf(v, "number")) {
              that.setAttribute("normal-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
            }
        }
      },
      type: [Number, Symbol]
    });

    /**
     * @member {number|string}
     */
    this.defineProperty("largeColumn", {
      /**
       * @returns {string}
       */
      get() {
        var v = that.getAttribute("large-column");
        switch (v) {
          case "":
            return EWindow.NONE;
            break;

          case "small":
            return EWindow.XSMALL;
            break;

          case "medium":
            return EWindow.SMALL;
            break;

          case "normal":
            return EWindow.MEDIUM;
            break;

          case "xlarge":
            return EWindow.XLarge;
            break;

          default:
            v = parseInt(v, 12);
            return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
        }
      },
      /**
       * @param {string} v
       */
      set(v) {
        switch (v) {
          case EWindow.NONE:
            that.setAttribute("large-column", "");
            break;

          case EWindow.XSMALL:
            that.setAttribute("large-column", "small");
            break;

          case EWindow.SMALL:
            that.setAttribute("large-column", "medium");
            break;

          case EWindow.MEDIUM:
            that.setAttribute("large-column", "normal");
            break;

          case EWindow.XLarge:
            that.setAttribute("large-column", "xlarge");
            break;

          default:
            if (instanceOf(v, "number")) {
              that.setAttribute("large-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
            }
        }
      },
      type: [Number, Symbol]
    });

    /**
     * @member {number|string}
     */
    this.defineProperty("xlargeColumn", {
      /**
       * @returns {string}
       */
      get() {
        var v = that.getAttribute("xlarge-column");
        switch (v) {
          case "":
            return EWindow.NONE;
            break;

          case "small":
            return EWindow.XSMALL;
            break;

          case "medium":
            return EWindow.SMALL;
            break;

          case "normal":
            return EWindow.MEDIUM;
            break;

          case "large":
            return EWindow.LARGE;
            break;

          default:
            v = parseInt(v, 12);
            return ((v < 1) ? "1" : ((v > 12) ? "12" : v));
        }
      },
      /**
       * @param {string} v
       */
      set(v) {
        switch (v) {
          case EWindow.NONE:
            that.setAttribute("xlarge-column", "");
            break;

          case EWindow.XSMALL:
            that.setAttribute("xlarge-column", "small");
            break;

          case EWindow.SMALL:
            that.setAttribute("xlarge-column", "medium");
            break;

          case EWindow.MEDIUM:
            that.setAttribute("xlarge-column", "normal");
            break;

          case EWindow.LARGE:
            that.setAttribute("xlarge-column", "large");
            break;

          default:
            if (instanceOf(v, "number")) {
              that.setAttribute("xlarge-column", ((v < 1) ? "1" : ((v > 12) ? "12" : v)));
            }
        }
      },
      type: [Number, Symbol]
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("hideOnSmall", {
      /**
       * @returns {boolean}
       */
      get() {
        return that.getAttribute("hide-on-small");
      },
      /**
       * @param {boolean} v
       */
      set(v) {
        that.setAttribute("hide-on-small", v);
      },
      type: Boolean
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("hideOnMedium", {
      /**
       * @returns {boolean}
       */
      get() {
        return that.getAttribute("hide-on-medium");
      },
      /**
       * @param {boolean} v
       */
      set(v) {
        that.setAttribute("hide-on-medium", v);
      },
      type: Boolean
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("hideOnNormal", {
      /**
       * @returns {boolean}
       */
      get() {
        return that.getAttribute("hide-on-normal");
      },
      /**
       * @param {boolean} v
       */
      set(v) {
        that.setAttribute("hide-on-normal", v);
      },
      type: Boolean
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("hideOnLarge", {
      /**
       * @returns {boolean}
       */
      get() {
        return that.getAttribute("hide-on-large");
      },
      /**
       * @param {boolean} v
       */
      set(v) {
        that.setAttribute("hide-on-large", v);
      },
      type: Boolean
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("hideOnXlarge", {
      /**
       * @returns {boolean}
       */
      get() {
        return that.getAttribute("hide-on-xlarge");
      },
      /**
       * @param {boolean} v
       */
      set(v) {
        that.setAttribute("hide-on-xlarge", v);
      },
      type: Boolean
    });

    /**
     * @member {Symbol}
     */
    this.defineProperty("float", {
      /**
       * @returns {string}
       */
      get() {
        switch (that.getAttribute("float")) {
          case "left":
            return EControl.LEFT;
            break;
          case "right":
            return EControl.RIGHT;
            break;
          case "center":
            return EControl.CENTER;
            break;
          default:
            return EControl.NONE;
            break;
        }
      },
      /**
       * @param {string} v
       */
      set(v) {
        switch (v) {
          case EControl.LEFT:
            that.setAttribute("float", "left");
            break;
          case EControl.RIGHT:
            that.setAttribute("float", "right");
            break;
          case EControl.CENTER:
            that.setAttribute("float", "center");
            break;
          default:
            that.setAttribute("float", "");
            break;
        }
      },
      type: Symbol
    });

    /**
     * @member {Symbol}
     */
    this.defineProperty("align", {
      /**
       * @returns {string}
       */
      get() {
        switch (that.getAttribute("align")) {
          case "left":
            return EControl.LEFT;
            break;
          case "right":
            return EControl.RIGHT;
            break;
          case "center":
            return EControl.CENTER;
            break;
          case "justify":
            return EControl.JUSTIFY;
            break;
          default:
            return EControl.NONE;
            break;
        }
      },
      /**
       * @param {string} v
       */
      set(v) {
        switch (v) {
          case EControl.LEFT:
            that.setAttribute("align", "left");
            break;
          case EControl.RIGHT:
            that.setAttribute("align", "right");
            break;
          case EControl.CENTER:
            that.setAttribute("align", "center");
            break;
          case EControl.JUSTIFY:
            that.setAttribute("align", "justify");
            break;
          default:
            that.setAttribute("align", "");
            break;
        }
      },
      type: Symbol
    });

    /**
     * @member {string}
     */
    this.defineProperty("templateName", {
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
      },
      type: String
    });

    /**
     * @member {string}
     */
    this.defineProperty("templateItem", {
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
      },
      type: String
    });

    this.defineProperty("hoverable", {
      get() {
        return (that.getAttribute("element-hoverable") === "true");
      },
      set(v) {
        that.setAttribute("element-hoverable", v ? "true" : "false");
      },
      type: Boolean
    });

    this.defineProperty("situation", {
      get() {
        var v = that.getAttribute("element-situation");

        switch (v) {
          case "title":
            return EControl.TITLE;

          case "default":
            return EControl.DEFAULT;

          case "transparent":
            return EControl.TRANSPARENT;

          case "opposite":
            return EControl.OPPOSITE;

          case "warning":
            return EControl.WARNINg;

          case "danger":
            return EControl.DANGER;

          case "disable":
            return EControl.DISABLE;

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

          case EControl.DEFAULT:
            that.setAttribute("element-situation", "default");
            break;

          case EControl.TRANSPARENT:
            that.setAttribute("element-situation", "transparent");
            break;

          case EControl.OPPOSITE:
            that.setAttribute("element-situation", "opposite");
            break;

          case EControl.WARNINg:
            that.setAttribute("element-situation", "warning");
            break;

          case EControl.DANGER:
            that.setAttribute("element-situation", "danger");
            break;

          case EControl.DISABLE:
            that.setAttribute("element-situation", "disable");
            break;

          case EControl.OK:
            that.setAttribute("element-situation", "ok");
            break;

          case EControl.NONE:
          default:
            that.setAttribute("element-situation", "");
            break;
        }
      },
      type: Symbol
    });

    /**
     * @param {Element|Control} control
     */
    this.defineMethod("addControl", (control) => {
      superAddControl(control);
      elmDivContainer.appendChild(elmTxtFoot);
    }, [Control, Element]);

    this.defineMethod("click", () => {
      elmDivContainer.click();
    });

    // this.focus = function () {
    //     elmDivContainer.focus();
    // };

    this.defineMethod("toString", () => {
      return "[Control]";
    });
  }
}

export const EControl = Object.freeze({
  LEFT: Symbol("left"),
  RIGHT: Symbol("right"),
  CENTER: Symbol("center"),
  JUSTIFY: Symbol("justify"),
  NONE: Symbol("none"),
  DEFAULT: Symbol("default"),
  TITLE: Symbol("title"),
  TRANSPARENT: Symbol("transparent"),
  OPPOSITE: Symbol("opposite"),
  WARNINg: Symbol("warning"),
  DANGER: Symbol("danger"),
  DISABLE: Symbol("disable"),
  OK: Symbol("ok")
});