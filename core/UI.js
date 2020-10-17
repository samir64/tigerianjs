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

"use strict";

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
   */
  constructor(mainElement = document.body, parent = undefined) {
    super();
    this.abstract(UI);

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

    //NOTE: Constructor: Prerequirement checks
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

    //NOTE Private Functions
    /**
     * @param {Boolean} v
     */
    // function setVisible(v) {
    //   if (instanceOf(v, "Boolean")) {
    //     let lastVisible = that.visible === "true";
    //     that.visible = v;

    //     if (lastVisible !== v) {
    //       that.dispatchEvent(Events.onVisibleChange);
    //     }
    //   }
    // }

    /**
     * @param {Elemenet} element
     * @param {String} themeName
     */
    // function addThemeToChildren(element, themeName) {
    //   forEach(Array.from(element.children), (elm, index) => {
    //     if (
    //       elm.hasAttribute("element-name") &&
    //       elm.dataset.elementName === "container"
    //     ) {
    //       elm.classList.add(themeName);
    //     }
    //     addThemeToChildren(elm, themeName);
    //   });
    // }

    /**
     * @param {Elemenet} element
     * @param {String} themeName
     */
    // function removeThemeFromChildren(element, themeName) {
    //   forEach(Array.from(element.children), (elm, index) => {
    //     if (
    //       elm.hasAttribute("element-name") &&
    //       elm.dataset.elementName === "container"
    //     ) {
    //       elm.classList.remove(themeName);
    //     }
    //     removeThemeFromChildren(elm, themeName);
    //   });
    // }

    /**
     * @param {Elemenet} element
     */
    // function removeAllThemesFromChildren(element) {
    //   forEach(Array.from(element.children), (elm, index) => {
    //     if (
    //       elm.hasAttribute("element-name") &&
    //       elm.dataset.elementName === "container"
    //     ) {
    //       elm.className = "";
    //     }
    //     removeAllThemesFromChildren(elm);
    //   });
    // }

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
        return !mainElement.hasAttribute("disabled");
      },
      /**
       * @param {Boolean} value
       */
      set(v) {
        if (v === false) {
          mainElement.disabled = "true";
        } else {
          mainElement.removeAttribute("disabled");
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

        mainElement.dataset.focused = result;

        return result;
      },
      set(v) {
        this.dataset.focused = v;
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
          let dir = mainElement.getAttribute("dir");
          switch (dir) {
            case "ltr":
              return EUI.LEFT_TO_RIGHT;
              break;
            case "rtl":
              return EUI.RIGHT_TO_LEFT;
              break;
            default:
              return EUI.NONE;
          }
        }
      },
      set(v) {
        switch (v) {
          case EUI.LEFT_TO_RIGHT:
            this.dataset.dir = "ltr";
            break;
          case EUI.RIGHT_TO_LEFT:
            this.dataset.dir = "rtl";
            break;
          default:
            this.removeAttribute("dir");
        }
      }
    });

    /**
     * @member {Boolean}
     */
    // Object.defineProperty(this, "visible", {
    //   enumerable: true,
    //   configurable: true,
    //   /**
    //    * @returns {Boolean}
    //    */
    //   get() {
    //     return (this.dataset.visible === "true");
    //   },
    //   /**
    //    * @param {Boolean} v
    //    */
    //   set(v) {
    //     setVisible(v);
    //   }
    // });

    /**
     * @member {String}
     */
    // Object.defineProperty(this, "theme", {
    //   enumerable: true,
    //   configurable: true,
    //   /**
    //    * @returns {String}
    //    */
    //   get() {
    //     return mainElement.className;
    //   }
    // });

    // Object.defineProperty(this, "dataset", {
    //   enumerable: true,
    //   configurable: true,
    //   get() {
    //     return mainElement.dataset;
    //   }
    // });

    //NOTE Public Functions
    /**
     * @callback ATTRIBUTE_CALLBACK
     * @param {String} method
     * @param {any} value
     */
    /**
     * @param {String} name 
     * @param {Function} type 
     * @param {any} defaultValue = undefined
     * @param {ATTRIBUTE_CALLBACK} callback
     */
    this.attribute = (name, type, defaultValue, callback = (method, value) => value) => {
      let typeReversed;
      let value = defaultValue;
      if (instanceOf(type, "object")) {
        typeReversed = Object.entries(type).reduce((result, entry) => {
          result[entry[1].toString()] = entry[0];
          return result;
        }, {});
        // value = typeReversed[defaultValue.toString()];
        value = defaultValue.toString();
        if (typeReversed[value]) {
          defaultValue = value;
        } else {
          value = undefined;
        }
      } else if (instanceOf(type, Function)) {
        if (!instanceOf(defaultValue, type)) {
          value = undefined;
        }
      }

      if (value === undefined) {
        throw new Error(`defaultValue's type is ${typeof defaultValue}, Expected ${type}`);
      }

      mainElement.dataset[name] = value;

      if (attributesSetProtected.indexOf(name) >= 0) {
        Object.defineProperty(this, name, {
          enumerable: true,
          configurable: attributesRemoveProtected.indexOf(name) === -1,
          get() {
            let result;
            if (typeReversed) {
              result = type[typeReversed[mainElement.dataset[name]]];
            } else {
              result = mainElement.dataset[name];
            }

            return callback("get", result);
          },
        });
      } else {
        Object.defineProperty(this, name, {
          enumerable: true,
          configurable: attributesRemoveProtected.indexOf(name) === -1,
          get() {
            let result;
            if (typeReversed) {
              result = type[typeReversed[mainElement.dataset[name]]];
            } else {
              result = mainElement.dataset[name];
            }

            return callback("get", result);
          },
          set(v) {
            let value = callback("set", v);
            if (typeReversed) {
              // value = typeReversed[v];
              value = v.toString();
            } else {
              if (!instanceOf(value, type)) {
                value = undefined;
              }
            }

            if (value === undefined) {
              // throw new Error(`${name} expected ${type.toString()} but got ${typeof v}`);
              value = defaultValue;
            }

            mainElement.dataset[name] = value;
          },
        });
      }
    };

    this.hasAttribute = name => name in mainElement.dataset;

    this.removeAttribute = name => {
      delete mainElement.dataset[name];
      delete this[name];
    };

    this.remove = () => {
      this.parent = undefined;
    };

    /**
     * @param {UI|Element|Text} control
     */
    this.addControl = (control) => {
      if (instanceOf(control, Element) || instanceOf(control, Text)) {
        control.datasetelementType = this.constructor.name;
        control.dataset.elementOrigin = "Child";
        mainElement.appendChild(control);
      } else if (instanceOf(control, UI)) {
        control.appendTo(that, mainElement);
      }
    };

    /**
     * @param {String} attrName
     * @param {String} attrValue
     */
    // this.setAttribute = (attrName, attrValue) => {
    //   if (
    //     instanceOf(mainElement, Element) &&
    //     attributesSetProtected.indexOf(attrName) === -1
    //   ) {
    //     mainElement.setAttribute(attrName, attrValue.toString());
    //   }
    // };

    /**
     * @param {String} attrName
     * @returns {String}
     */
    // this.getAttribute = (attrName) => {
    //   if (
    //     instanceOf(mainElement, Element)
    //   ) {
    //     return mainElement.dataset[attrName];
    //   }
    // };

    /**
     * @param {String} attrName
     * @returns {Boolean}
     */
    // this.hasAttribute = (attrName) => {
    //   if (
    //     instanceOf(mainElement, Element)
    //   ) {
    //     return mainElement.hasAttribute(attrName);
    //   }
    // };

    /**
     * @param {String} attrName
     */
    // this.removeAttribute = (attrName) => {
    //   if (
    //     instanceOf(mainElement, Element) &&
    //     attributesRemoveProtected.indexOf(attrName) === -1
    //   ) {
    //     mainElement.removeAttribute(attrName);
    //   }
    // };

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
    // this.addTheme = (themeName, affectChildren = true) => {
    //   if (instanceOf(themeName, String) && themeName !== "") {
    //     themeName = themeName.split(" ")[0];
    //     mainElement.classList.add(themeName);

    //     if (affectChildren !== false) {
    //       addThemeToChildren(mainElement, themeName);
    //     }
    //   }
    // };

    /**
     * @param {String} themeName
     * @param {Boolean} affectChildren = true
     */
    // this.removeTheme = (themeName, affectChildren = true) => {
    //   if (instanceOf(themeName, String) && themeName !== "") {
    //     themeName = themeName.split(" ")[0];
    //     mainElement.classList.remove(themeName);

    //     if (affectChildren !== false) {
    //       removeThemeFromChildren(mainElement, themeName);
    //     }
    //   }
    // };

    /**
     * @param {Boolean} affectChildren = true
     */
    // this.removeAllThemes = (affectChildren = true) => {
    //   mainElement.className = "";

    //   if (affectChildren !== false) {
    //     removeAllThemesFromChildren(mainElement);
    //   }
    // };

    /**
     * @param {number} index
     * @returns {String}
     */
    // this.getTheme = (index) => {
    //   return mainElement.classList.item(index);
    // };

    /**
     * @param {String themeName}
     * @returns {Boolean}
     */
    // this.hasTheme = (themeName) => {
    //   return mainElement.classList.contains(themeName);
    // };

    /**
     * @returns {number}
     */
    // this.themeCount = () => {
    //   return mainElement.classList.length;
    // };

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

    // NOTE: Attibutes
    this.attribute("elementType", String, this.constructor.name);
    this.attribute("elementOrigin", String, "Container");
    this.attribute("elementName", String, "");
    this.attribute("visible", Boolean, true, (method, value) => {
      if (method === "set") {
        that.dispatchEvent(Events.onVisibleChange, {
          visible: value
        });
      }
      return value;
    });

    // if (instanceOf(theme, String) && theme !== "") {
    //   this.addTheme(theme);
    // }

    if (parent !== undefined) {
      parent.addControl(this);
    }
  }
}

export const EUI = Object.freeze({
  NONE: Symbol("none"),
  RIGHT_TO_LEFT: Symbol("rtl"),
  LEFT_TO_RIGHT: Symbol("ltr")
});