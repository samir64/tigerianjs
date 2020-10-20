import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  Events
} from "../core/Events.js";

/**
 * Created by samir on 8/26/16.
 */

/**
 * @extends {Control}
 * @implements {BText}
 * @constructor
 */
export class TextBox extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} [text = ""]
   * @param {string} [theme = ""]
   */
  constructor(parent, text = "") {
    let elmText = document.createElement("input");
    super(parent);
    this.config(BText, elmText, TextEncoder);

    let thisEnabled = Object.getOwnPropertyDescriptor(this, "enabled");
    let that = this;

    //NOTE Attributes
    // this.setAttribute("element-type", "TextBox");
    this.dataset.elementName = "container";

    // elmText.setAttribute("element-type", "TextBox");
    // elmText.setAttribute("element-name", "input");
    // elmText.dataset.type = "headText";
    // if (!instanceOf(text, String)) {
    //     text = "";
    // }
    // elmText.value = text;

    //NOTE Append Children
    this.addControl(elmText);

    //NOTE Public Properties
    /**
     * @member {string}
     */
    // Object.defineProperty(this, "text", {
    //     enumerable: true,
    //     configurable: true,
    //     get () {
    //         return elmText.value;
    //     },

    //     set (v) {
    //         if (instanceOf(v, String)) {
    //             elmText.value = v;
    //         }
    //     }
    // });

    /**
     * @member {boolean}
     */
    Object.defineProperty(this, "enabled", {
      enumerable: true,
      configurable: true,
      get() {
        return thisEnabled.get.bind(that)();
      },

      set(v) {
        thisEnabled.set.bind(that)(v);
        if (v === false) {
          elmText.dataset.disabled = "true";
        } else {
          elmText.removeAttribute("disabled");
        }
      }
    });

    /**
     * @member {string}
     */
    Object.defineProperty(this, "pattern", {
      enumerable: true,
      configurable: true,
      get() {
        return elmText.dataset.pattern;
      },

      set(v) {
        elmText.dataset.pattern = v;
        that.checkValidity();
      }
    });

    /**
     * @member {boolean}
     */
    Object.defineProperty(this, "required", {
      enumerable: true,
      configurable: true,
      get() {
        return elmText.hasAttribute("required");
      },

      set(v) {
        if (v === true) {
          elmText.dataset.required = "true";
        } else {
          elmText.removeAttribute("required");
        }

        that.checkValidity();
      }
    });

    /**
     * @member {number}
     */
    Object.defineProperty(this, "tabIndex", {
      enumerable: true,
      configerable: true,
      get() {
        return elmText.hasAttribute("tabindex") ?
          elmButton.dataset.tabindex :
          0;
      },
      set(v) {
        if (v > 0) {
          elmText.dataset.tabindex = v;
        } else {
          elmText.removeAttribute("tabindex");
        }
      }
    });

    //NOTE Private Functions
    function onClick(e) {
      elmText.focus();
    }

    //NOTE Public Functions
    this.select = () => {
      elmText.select();
    };

    /**
     * @return boolean
     */
    this.isValid = () => {
      this.dataset.validity = elmText.validity.valid;
      return elmText.validity.valid;
    };

    //NOTE Default Event
    this.addEvent("click", onClick);
    elmText.addEventListener(
      "input",
      ((e) => {
        this.isValid();
      }).bind(this),
      true
    );
    elmText.addEventListener(
      "focus",
      ((e) => {
        this.dispatchEvent(Events.onFocus);
      }).bind(this),
      true
    );
    elmText.addEventListener(
      "blur",
      ((e) => {
        this.dispatchEvent(Events.onBlur);
      }).bind(this),
      true
    );

    delete this.addControl;
  }
}