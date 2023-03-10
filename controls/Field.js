import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  TextBox
} from "./TextBox.js";
import {
  Label
} from "./Label.js";

/**
 * Created by samir on 8/26/16.
 */

/**
 * @class
 * @extends {Control}
 * @implements {BText}
 */
export class Field extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} [label = ""]
   * @param {string} [text = ""]
   * @param {string} [theme = ""]
   */
  constructor(parent, label = "", text = "") {
    super(parent);

    let ctrlText = new TextBox(this, text);
    let ctrlLabel = new Label(this, label);

    let superEnabled = Object.getOwnPropertyDescriptor(this, "enabled");

    this.config(BText, ctrlText, text);

    ctrlLabel.source = ctrlText;
    ctrlLabel.situation = Control.ETransparent;

    //NOTE Attributes
    // this.setAttribute("element-type", "Field");
    this.dataset.elementName = "container";

    // this.setAttribute("empty", (ctrlText.text === "") ? "true" : "false");

    ctrlLabel.source = ctrlText;

    /**
     * @member {boolean}
     */
    Object.defineProperty(this, "enabled", {
      enumerable: true,
      configurable: true,
      get: superEnabled.get.bind(this),
      set(v) {
        ctrlLabel.enabled = v;
        ctrlText.enabled = v;
        superEnabled.set.bind(this)(v);
      },
    });

    /**
     * @member {string}
     */
    Object.defineProperty(this, "label", {
      enumerable: true,
      configurable: true,
      get() {
        // return ctrlLabel;
        return ctrlLabel.text;
      },
      set(v) {
        ctrlLabel.text = v;
      },

    });


    //NOTE Private Functions
    function onClick(e) {
      ctrlText.select();
    }

    // function onChange(e) {
    //     this[0].setAttribute("empty", (this[1].text === "") ? "true" : "false");
    // }

    function onFocus(e) {
      this.dataset.focused = "true";
    }

    function onBlur(e) {
      this.dataset.focused = "false";
    }

    //NOTE Public Functions
    this.select = () => {
      ctrlText.select();
    };


    //NOTE Default Event
    ctrlLabel.addEvent("click", onClick);
    // ctrlText.addEvent("input", onChange.bind([this, ctrlText]));
    ctrlText.addEvent("focus", onFocus.bind(this));
    ctrlText.addEvent("blur", onBlur.bind(this));
  }
}