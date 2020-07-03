import {
  instanceOf,
  Tigerian,
  forEach,
  // abstract
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
  BTransition
} from "../behaviors/BTransition.js";
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
   * @param {String} [theme]
   */
  constructor(mainElement = document.body, parent = undefined, theme = "") {
    super();

    this.abstract(UI);

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
    this.config(BTransition, mainElement);

    mainElement.setAttribute("element-type", this.constructor.name);
    mainElement.setAttribute("element-origin", "Container");

    //NOTE Private Constants
    /**
     * @type {String[]}
     */
    let attributesSetProtected = [
      "element-type",
      "element-origin"
    ];
    /**
     * @type {String[]}
     */
    let attributesRemoveProtected = attributesSetProtected.concat([
      "visible",
      "element-name",
      "id",
      "transition-name",
      "transition-status",
      "focused",
      "style",
      "element-situation",
      "element-hoverable",
      "xsmall-column",
      "small-column",
      "medium-column",
      "large-column",
      "xlarge-column",
      "template-name",
      "template-item",
      "title",
      "text"
      // "element-type"
    ]);

    //NOTE Private Variables
    let that = this;

    //NOTE Properties
    /**
     * @member {Tigerin.UI|Element}
     */
    Object.defineProperty(this, "parent", {
      enumerable: true,
      configurable: true,
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
      }
    });

    /**
     * @member {Boolean}
     */
    Object.defineProperty(this, "enabled", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {Boolean}
       */
      get() {
        return !this.hasAttribute("disabled");
      },
      /**
       * @param {Boolean} value
       */
      set(v) {
        if (v === false) {
          that.setAttribute("disabled", "true");
        } else {
          that.removeAttribute("disabled");
        }
      }
    });

    /**
     * @member {Boolean}
     */
    Object.defineProperty(this, "focused", {
      enumerable: true,
      configurable: true,
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
      }
    });

    /**
     * @member {Symbol}
     */
    Object.defineProperty(this, "direction", {
      enumerable: true,
      configurable: true,
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
      }
    });

    /**
     * @member {Boolean}
     */
    Object.defineProperty(this, "visible", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {Boolean}
       */
      get() {
        return (this.getAttribute("visible") === "true");
      },
      /**
       * @param {Boolean} v
       */
      set(v) {
        setVisible(v);
      }
    });

    /**
     * @member {String}
     */
    Object.defineProperty(this, "theme", {
      enumerable: true,
      configurable: true,
      /**
       * @returns {String}
       */
      get() {
        return mainElement.className;
      }
    });

    //NOTE Private Functions
    /**
     * @param {Boolean} v
     */
    function setVisible(v) {
      if (instanceOf(v, "Boolean")) {
        let lastVisible = that.getAttribute("visible") === "true";
        that.setAttribute("visible", v ? "true" : "false");

        if (lastVisible !== v) {
          that.dispatchEvent(Events.onVisibleChange);
        }
      }
    }

    /**
     * @param {Elemenet} element
     * @param {String} themeName
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
      elm.yield = () => {
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
     * @param {String} themeName
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
      elm.yield = () => {
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
      elm.yield = () => {
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
    this.remove = () => {
      this.parent = undefined;
    };

    /**
     * @param {UI|Element|Text} control
     */
    this.addControl = (control) => {
      if (instanceOf(control, Element) || instanceOf(control, Text)) {
        control.setAttribute("element-type", this.constructor.name);
        control.setAttribute("element-origin", "Child");
        mainElement.appendChild(control);
      } else if (instanceOf(control, UI)) {
        control.appendTo(that, mainElement);
      }
    };

    /**
     * @param {String} attrName
     * @param {String} attrValue
     */
    this.setAttribute = (attrName, attrValue) => {
      if (
        instanceOf(mainElement, Element) &&
        attributesSetProtected.indexOf(attrName) === -1
      ) {
        mainElement.setAttribute(attrName, attrValue.toString());
      }
    };

    /**
     * @param {String} attrName
     * @returns {String}
     */
    this.getAttribute = (attrName) => {
      if (
        instanceOf(mainElement, Element)
      ) {
        return mainElement.getAttribute(attrName);
      }
    };

    /**
     * @param {String} attrName
     * @returns {Boolean}
     */
    this.hasAttribute = (attrName) => {
      if (
        instanceOf(mainElement, Element)
      ) {
        return mainElement.hasAttribute(attrName);
      }
    };

    /**
     * @param {String} attrName
     */
    this.removeAttribute = (attrName) => {
      if (
        instanceOf(mainElement, Element) &&
        attributesRemoveProtected.indexOf(attrName) === -1
      ) {
        mainElement.removeAttribute(attrName);
      }
    };

    /**
     * @param {Element} elmContainer
     * @returns {Boolean}
     */
    this.matchContainer = (elmContainer) => {
      return elmContainer === mainElement;
    };

    /**
     * @param {UI} parentControl
     * @param {Element} elmParentContainer
     */
    this.appendTo = (parentControl, elmParentContainer) => {
      if (
        instanceOf(parentControl, UI) &&
        parentControl.matchContainer(elmParentContainer)
      ) {
        parent = parentControl;
        elmParentContainer.appendChild(mainElement);
      }
    };

    /**
     * @param {String} themeName
     * @param {Boolean} affectChildren = true
     */
    this.addTheme = (themeName, affectChildren = true) => {
      if (instanceOf(themeName, String) && themeName !== "") {
        themeName = themeName.split(" ")[0];
        mainElement.classList.add(themeName);

        if (affectChildren !== false) {
          addThemeToChildren(mainElement, themeName);
        }
      }
    };

    /**
     * @param {String} themeName
     * @param {Boolean} affectChildren = true
     */
    this.removeTheme = (themeName, affectChildren = true) => {
      if (instanceOf(themeName, String) && themeName !== "") {
        themeName = themeName.split(" ")[0];
        mainElement.classList.remove(themeName);

        if (affectChildren !== false) {
          removeThemeFromChildren(mainElement, themeName);
        }
      }
    };

    /**
     * @param {Boolean} affectChildren = true
     */
    this.removeAllThemes = (affectChildren = true) => {
      mainElement.className = "";

      if (affectChildren !== false) {
        removeAllThemesFromChildren(mainElement);
      }
    };

    /**
     * @param {number} index
     * @returns {String}
     */
    this.getTheme = (index) => {
      return mainElement.classList.item(index);
    };

    /**
     * @param {String themeName}
     * @returns {Boolean}
     */
    this.hasTheme = (themeName) => {
      return mainElement.classList.contains(themeName);
    };

    /**
     * @returns {number}
     */
    this.themeCount = () => {
      return mainElement.classList.length;
    };

    /**
     * @returns {String}
     */
    this.toString = () => {
      return "[Tigerian Instance]";
    };

    /**
     * @param {Boolean} scrollTo = false
     */
    this.focus = (scrollTo = false) => {
      mainElement.focus({
        preventScroll: true
      });

      if (scrollTo === true) {
        mainElement.scrollIntoView();
      }
    };

    this.clear = () => {
      let children = mainElement.querySelectorAll(
        '[element-name="container"]'
      );
      for (let i = 0; i < children.length; i++) {
        if (children[i].parentElement === mainElement) {
          mainElement.removeChild(children[i]);
        }
      }
    };

    //NOTE Attributes
    this.setAttribute("element-name", "");
    // this.setAttribute("element-type", "");
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