import {
  instanceOf,
  Tigerian,
  forEach
} from "./Tigerian.js";
import {
  BBind
} from "../behaviors/BBind.js";
import {
  BStyle
} from "../behaviors/BStyle.js";
import {
  BEvent
} from "../behaviors/BEvent.js";
import {
  Events
} from "./Events.js";

/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */

("use strict");

/**
 * @implements {BBind}
 * @extends {Class}
 *
 * @constructor
 * @abstract
 */
export class UI extends Tigerian {
  /**
   * @param {Element} [mainElement = document.body]
   * @param {UI} [parent = undefined]
   * @param {string} [theme]
   */
  constructor(mainElement = document.body, parent = undefined, theme = "") {
    super();

    let that = this;

    if (instanceOf(mainElement, String)) {
      if (mainElement[0] === "#") {
        mainElement = document.getElementById(mainElement.substring(1));
      }
    } else if (!(instanceOf(mainElement, Element) || instanceOf(mainElement, DocumentFragment))) {
      mainElement = document.body;
    }

    if (!instanceOf(parent, UI)) {
      parent = undefined;
    }

    for (let i = 0; i < mainElement.children.length; i++) {
      mainElement.removeChild(mainElement.children[i]);
    }

    this.config(BBind);
    this.config(BStyle, mainElement);
    this.config(BEvent, mainElement);

    //NOTE Private Constants
    /**
     * @type {string[]}
     */
    let attributesSetProtected = [];
    /**
     * @type {string[]}
     */
    let attributesRemoveProtected = attributesSetProtected.concat([
      "visible",
      "element-name",
      "element-type"
    ]);

    //NOTE Private Variables
    let instance = this;

    //NOTE Properties
    /**
     * @member {Tigerin.UI|Element}
     */
    this.defineProperty("parent", {
      /**
       * @returns {Application}
       */
      get() {
        return parent;
      },
      /**
       * @param {UI} value
       */
      set(v) {
        if (v === undefined) {
          parent = undefined;
          if (mainElement.parentNode) {
            mainElement.parentNode.removeChild(mainElement);
          }
        } else if (instanceOf(v, UI)) {
          parent = v;
          v.addControl(this);
        } else if (instanceOf(v, Element)) {
          v.appendChild(mainElement);
          parent = v;
        }
      },
      type: [UI, Element, undefined]
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("enabled", {
      /**
       * @returns {boolean}
       */
      get() {
        return !this.hasAttribute("disabled");
      },
      /**
       * @param {boolean} value
       */
      set(v) {
        if (v === false) {
          this.setAttribute("disabled", "true");
        } else {
          this.removeAttribute("disabled");
        }
      },
      type: Boolean
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("focused", {
      get() {
        let result = document.activeElement === mainElement;

        for (let i = 0; !result && i < mainElement.children.length; i++) {
          result = document.activeElement === mainElement.children[i];
        }

        return result;
      },
      set(v) {
        this.setAttribute("focused", v);
        if (v === true) {
          this.focus();
        } else if (this.focused) {
          document.activeElement = undefined;
        }
      },
      type: Boolean
    });

    /**
     * @member {Symbol}
     */
    this.defineProperty("direction", {
      get() {
        if (this.hasAttribute("dir")) {
          let dir = this.getAttribute("dir");
          switch (dir) {
            case "ltr":
              return EUI.LEFT_TO_RIGHT;
              break;
            case "rtl":
              return EUI.RIGHT_TO_LEFT;
              break;
            default:
              return "";
          }
        }
      },
      set(v) {
        switch (v) {
          case EUI.LEFT_TO_RIGHT:
            this.setAttribute("dir", "ltr");
            break;
          case EUI.RIGHT_TO_LEFT:
            this.setAttribute("dir", "rtl");
            break;
          default:
            this.removeAttribute("dir");
        }
      },
      type: Symbol
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("visible", {
      /**
       * @returns {boolean}
       */
      get() {
        return (this.getAttribute("visible") === "true");
      },
      /**
       * @param {boolean} v
       */
      set(v) {
        setVisible(v);
      },
      type: Boolean
    });

    /**
     * @member {string}
     */
    this.defineProperty("theme", {
      /**
       * @returns {string}
       */
      get() {
        return mainElement.className;
      }
    });

    //NOTE Private Functions
    /**
     * @param {boolean} v
     */
    function setVisible(v) {
      if (instanceOf(v, "boolean")) {
        let lastVisible = instance.getAttribute("visible") === "true";
        instance.setAttribute("visible", v ? "true" : "false");

        if (lastVisible !== v) {
          instance.dispatchEvent(Events.onVisibleChange);
        }
      }
    }

    /**
     * @param {Elemenet} element
     * @param {string} themeName
     */
    function addThemeToChildren(element, themeName) {
      forEach(Array.from(element.children), (elm, index) => {
        if (
          elm.hasAttribute("element-name") &&
          elm.getAttribute("element-name") === "container"
        ) {
          elm.classList.add(themeName);
        }
        addThemeToChildren(elm, themeName);
      });

      /* let elm = new Iterator(Array.from(element.children));
      elm.yield = function () {
        return this.list[this.index];
      };

      while (!elm.done) {
        if (
          elm.value.hasAttribute("element-name") &&
          elm.value.getAttribute("element-name") === "container"
        ) {
          elm.value.classList.add(themeName);
        }
        addThemeToChildren(elm.value, themeName);

        elm.next();
      } */
    }

    /**
     * @param {Elemenet} element
     * @param {string} themeName
     */
    function removeThemeFromChildren(element, themeName) {
      forEach(Array.from(element.children), (elm, index) => {
        if (
          elm.hasAttribute("element-name") &&
          elm.getAttribute("element-name") === "container"
        ) {
          elm.classList.remove(themeName);
        }
        removeThemeFromChildren(elm, themeName);
      });

      /* let elm = new Iterator(Array.from(element.children));
      elm.yield = function () {
        return this.list[this.index];
      };

      while (!elm.done) {
        if (
          elm.value.hasAttribute("element-name") &&
          elm.value.getAttribute("element-name") === "container"
        ) {
          elm.value.classList.remove(themeName);
        }
        removeThemeFromChildren(elm.value, themeName);

        elm.next();
      } */
    }

    /**
     * @param {Elemenet} element
     */
    function removeAllThemesFromChildren(element) {
      forEach(Array.from(element.children), (elm, index) => {
        if (
          elm.hasAttribute("element-name") &&
          elm.getAttribute("element-name") === "container"
        ) {
          elm.className = "";
        }
        removeAllThemesFromChildren(elm);
      });

      /* let elm = new Iterator(Array.from(element.children));
      elm.yield = function () {
        return this.list[this.index];
      };

      while (!elm.done) {
        if (
          elm.value.hasAttribute("element-name") &&
          elm.value.getAttribute("element-name") === "container"
        ) {
          elm.value.className = "";
        }
        removeAllThemesFromChildren(elm.value);

        elm.next();
      } */
    }

    //NOTE Public Functions
    this.defineMethod("remove", () => {
      this.parent = undefined;
    });

    /**
     * @param {Control|Element|Text} control
     */
    this.defineMethod("addControl", (control) => {
      if (instanceOf(control, Element) || instanceOf(control, Text)) {
        mainElement.appendChild(control);
      } else if (instanceOf(control, UI)) {
        control.appendTo(that, mainElement);
      }
    }, [
      [UI, Element, Text]
    ]);

    /**
     * @param {string} attrName
     * @param {string} attrValue
     */
    this.defineMethod("setAttribute", (attrName, attrValue) => {
      if (
        instanceOf(mainElement, Element) &&
        attributesSetProtected.indexOf(attrName) === -1
      ) {
        mainElement.setAttribute(attrName, attrValue.toString());
      }
    }, [String]);

    /**
     * @param {string} attrName
     * @returns {string}
     */
    this.defineMethod("getAttribute", (attrName) => {
      if (
        instanceOf(mainElement, Element)
      ) {
        return mainElement.getAttribute(attrName);
      }
    }, [String]);

    /**
     * @param {string} attrName
     * @returns {boolean}
     */
    this.defineMethod("hasAttribute", (attrName) => {
      if (
        instanceOf(mainElement, Element)
      ) {
        return mainElement.hasAttribute(attrName);
      }
    }, [String]);

    /**
     * @param {string} attrName
     */
    this.defineMethod("removeAttribute", (attrName) => {
      if (
        instanceOf(mainElement, Element) &&
        attributesRemoveProtected.indexOf(attrName) === -1
      ) {
        mainElement.removeAttribute(attrName);
      }
    }, [String]);

    /**
     * @param {Element} elmContainer
     * @returns {boolean}
     */
    this.defineMethod("matchContainer", (elmContainer) => {
      return elmContainer === mainElement;
    }, [
      [Element, DocumentFragment]
    ]);

    /**
     * @param {UI} parentControl
     * @param {Element} elmParentContainer
     */
    this.defineMethod("appendTo", (parentControl, elmParentContainer) => {
      if (
        instanceOf(parentControl, UI) &&
        parentControl.matchContainer(elmParentContainer)
      ) {
        parent = parentControl;
        elmParentContainer.appendChild(mainElement);
      }
    }, [UI, [Element, DocumentFragment]]);

    /**
     * @param {string} themeName
     * @param {boolean} affectChildren = true
     */
    this.defineMethod("addTheme", (themeName, affectChildren = true) => {
      if (instanceOf(themeName, String) && themeName !== "") {
        themeName = themeName.split(" ")[0];
        mainElement.classList.add(themeName);

        if (affectChildren !== false) {
          addThemeToChildren(mainElement, themeName);
        }
      }
    }, [String, Boolean]);

    /**
     * @param {string} themeName
     * @param {boolean} affectChildren = true
     */
    this.defineMethod("removeTheme", (themeName, affectChildren = true) => {
      if (instanceOf(themeName, String) && themeName !== "") {
        themeName = themeName.split(" ")[0];
        mainElement.classList.remove(themeName);

        if (affectChildren !== false) {
          removeThemeFromChildren(mainElement, themeName);
        }
      }
    }, [String, Boolean]);

    /**
     * @param {boolean} affectChildren = true
     */
    this.defineMethod("removeAllThemes", (affectChildren = true) => {
      mainElement.className = "";

      if (affectChildren !== false) {
        removeAllThemesFromChildren(mainElement);
      }
    }, [Boolean]);

    /**
     * @param {number} index
     * @returns {string}
     */
    this.defineMethod("getTheme", (index) => {
      return mainElement.classList.item(index);
    }, [Number]);

    /**
     * @param {string themeName}
     * @returns {boolean}
     */
    this.defineMethod("hasTheme", (themeName) => {
      return mainElement.classList.contains(themeName);
    }, [String]);

    /**
     * @returns {number}
     */
    this.defineMethod("themeCount", () => {
      return mainElement.classList.length;
    });

    /**
     * @returns {string}
     */
    this.defineMethod("toString", () => {
      return "[Tigerian Instance]";
    });

    /**
     * @param {boolean} scrollTo = false
     */
    this.defineMethod("focus", (scrollTo = false) => {
      mainElement.focus({
        preventScroll: true
      });

      if (scrollTo === true) {
        mainElement.scrollIntoView();
      }
    }, [Boolean]);

    this.defineMethod("clear", () => {
      let children = mainElement.querySelectorAll(
        '[element-name="container"]'
      );
      for (let i = 0; i < children.length; i++) {
        if (children[i].parentElement === mainElement) {
          mainElement.removeChild(children[i]);
        }
      }
    });

    //NOTE Attributes
    this.setAttribute("element-name", "");
    this.setAttribute("element-type", "");
    this.setAttribute("visible", "true");
    this.setAttribute(
      "focused",
      document.activeElement === mainElement ? "true" : "false"
    );

    if (instanceOf(theme, String) && theme !== "") {
      this.addTheme(theme);
    }

    if (parent !== undefined) {
      parent.addControl(this);
    }
  }
}

export const EUI = Object.freeze({
  RIGHT_TO_LEFT: Symbol("rtl"),
  LEFT_TO_RIGHT: Symbol("ltr")
});