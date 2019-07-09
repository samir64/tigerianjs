import { instanceOf } from "../core/Tigerian.js";

/**
 * Created by samir on 8/26/16.
 */

("use strict");

/**
 * @extends {Control}
 * @implements {BText}
 * @constructor
 */
Button = Control.extend(
  {
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} text = ""
     * @param {string} theme = ""
     */
    init: function(parent, text, theme) {
      //NOTE Private Variables
      var elmButton = document.createElement("div");

      this.super(parent, theme);
      this.config("text", elmButton);

      //NOTE Attributes
      this.setAttribute("element-type", "Button");
      this.setAttribute("element-name", "container");

      elmButton.setAttribute("element-type", "Button");
      // elmButton.setAttribute("element-name", "text");

      this.setAttribute("fit-content", "false");

      if (instanceOf(text, String)) {
        elmButton.innerHTML = text;
      }

      //NOTE Append Children
      this.addControl(elmButton);
      this.hoverable = true;

      //NOTE Properties
      /**
       * @member {number}
       */
      Object.defineProperty(this, "tabIndex", {
        enumerable: true,
        configerable: true,
        get: function() {
          return elmButton.hasAttribute("tabindex")
            ? elmButton.getAttribute("tabindex")
            : 0;
        },
        set: function(v) {
          if (instanceOf(v, "number")) {
            if (v > 0) {
              elmButton.setAttribute("tabindex", v);
            } else {
              elmButton.removeAttribute("tabindex");
            }
          }
        }
      });

      /**
       * @member {boolean}
       */
      Object.defineProperty(this, "fitContent", {
        enumerable: true,
        configerable: true,
        get: function() {
          return this.getAttribute("fit-content");
        },
        set: function(v) {
          if (instanceOf(v, "boolean")) {
            this.setAttribute("fit-content", v ? "true" : "false");
          }
        }
      });

      this.select = function() {
        elmButton.focus();
      };

      window.addEventListener(
        "keypress",
        function(e) {
          if (
            this.default &&
            !e.ctrlKey &&
            !e.altKey &&
            !e.shiftKey &&
            e.code === "Enter" &&
            document.activeElement.getAttribute("element-type") !== "Button"
          ) {
            elmButton.click(this);
          }
        }.bind(this),
        true
      );

      this.addEvent(
        "keypress",
        function(e) {
          if (
            !e.ctrlKey &&
            !e.altKey &&
            !e.shiftKey &&
            (e.code === "Enter" || e.code === "Space")
          ) {
            elmButton.click(this);
          }
        }.bind(this),
        true
      );

      delete this.addControl;
    }
  },
  BText
);
