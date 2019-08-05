import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import { BLabel } from "../behaviors/BLabel.js";

/**
 * Created by samir on 8/26/16.
 */

("use strict");

/**
 * @extends {Control}
 * @implements {BText}
 * @implements {BLabel}
 * @class
 */
export class Label extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text = ""
   * @param {string} theme = ""
   */
  constructor(parent, text, theme = "") {
    var elmLabel = document.createElement("div");
    var elmFormatText;
    var formatTextRenew = true;

    super(parent, theme);
    this.config(BText, elmLabel, text);
    this.config(BLabel);

    var initText = Object.getOwnPropertyDescriptor(this, "text");
    var source;
    var that = this;

    //NOTE Attributes
    this.setAttribute("element-type", "Label");
    this.setAttribute("element-name", "container");

    elmLabel.setAttribute("element-type", "Label");
    // elmLabel.setAttribute("element-name", "text");

    this.setAttribute("inline-mode", "false");

    // if (instanceOf(text, String)) {
    //     elmLabel.innerHTML = text;
    // }

    //NOTE Append Children
    this.addControl(elmLabel);

    var createFormatText = () => {
      if (formatTextRenew) {
        elmFormatText = document.createElement("div");

        elmFormatText.setAttribute("element-type", "Label");
        elmFormatText.setAttribute("element-name", "text");

        formatTextRenew = false;
      }
    };

    //NOTE Properties
    /**
     * @member {Control}
     */
    this.defineProperty("source", {
      get() {
        return source;
      },
      set(v) {
        source = v;
      },
      type: Control
    });

    this.defineProperty("text", {
      get: initText.get.bind(this),
      set(v) {
        elmFormatText.remove();
        createFormatText();
        initText.set.bind(this)(v);
      },
      type: String
    });

    /**
     * @param {string} text
     * @param {Control[]} ...controls
     */
    this.defineMethod("format", (text, controls) => {
      if (instanceOf(text, String)) {
        var lastIndex = 0;
        var pat = /@/g;
        var i = 0;

        controls = Array.from(arguments).slice(1);

        formatTextRenew = true;
        that.text = "";
        that.addControl(elmFormatText);

        while (pat.exec(text) != null && i < controls.length) {
          if (text[pat.lastIndex - 2] !== "\\") {
            if (instanceOf(controls[i], Control)) {
              var subText = text
                .substr(lastIndex, pat.lastIndex - lastIndex - 1)
                .replace("\\@", "@");
              var textNode = document.createTextNode(subText);
              elmFormatText.appendChild(textNode);
              controls[i].parent = elmFormatText;
              lastIndex = pat.lastIndex;
            }
            i++;
          }
        }

        var textNode = document.createTextNode(
          text.substr(lastIndex).replace("\\@", "@")
        );
        elmFormatText.appendChild(textNode);
      }
    });

    elmLabel.addEventListener(
      "click",
      (e) => {
        if (source) {
          source.select();
        }
      },
      true
    );

    // delete this.addControl;
    createFormatText();
  }
}