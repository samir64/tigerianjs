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

("use strict");

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
  constructor(parent, text = "", theme = "") {
    let elmText = document.createElement("input");
    super(parent, theme);
    this.config(BText, elmText, TextEncoder);

    let thisEnabled = Object.getOwnPropertyDescriptor(this, "enabled");
    let that = this;

    //NOTE Attributes
    this.setAttribute("element-type", "TextBox");
    this.setAttribute("element-name", "container");

    elmText.setAttribute("element-type", "TextBox");
    // elmText.setAttribute("element-name", "input");
    // elmText.setAttribute("type", "headText");
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
    // this.defineProperty("text", {
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
    this.defineProperty("enabled", {
      get() {
        return thisEnabled.get.bind(that)();
      },

      set(v) {
        thisEnabled.set.bind(that)(v);
        if (v === false) {
          elmText.setAttribute("disabled", "true");
        } else {
          elmText.removeAttribute("disabled");
        }
      },
      type: Boolean
    });

    /**
     * @member {string}
     */
    this.defineProperty("pattern", {
      get() {
        return elmText.getAttribute("pattern");
      },

      set(v) {
        elmText.setAttribute("pattern", v);
        that.checkValidity();
      },
      type: String
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("required", {
      get() {
        return elmText.hasAttribute("required");
      },

      set(v) {
        if (v === true) {
          elmText.setAttribute("required", "true");
        } else {
          elmText.removeAttribute("required");
        }

        that.checkValidity();
      },
      type: Boolean
    });

    /**
     * @member {number}
     */
    this.defineProperty("tabIndex", {
      enumerable: true,
      configerable: true,
      get() {
        return elmText.hasAttribute("tabindex") ?
          elmButton.getAttribute("tabindex") :
          0;
      },
      set(v) {
        if (v > 0) {
          elmText.setAttribute("tabindex", v);
        } else {
          elmText.removeAttribute("tabindex");
        }
      },
      type: Number
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
      this.setAttribute("validity", elmText.validity.valid);
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