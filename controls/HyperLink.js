import { instanceOf } from "../core/Tigerian.js";

/**
 * Created by samir on 8/26/16.
 */

("use strict");

/**
 * @extends {Control}
 * @implements {BText}
 * @implements {BLabel}
 * @constructor
 */
HyperLink = Control.extend(
  {
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} text
     * @param {string} url
     * @param {string} [theme = ""]
     */
    init: function(parent, text, url, theme) {
      this.super(parent, theme);

      //NOTE Private Variables
      var elmHyperLink = document.createElement("a");

      this.config("text", elmHyperLink);
      this.config("label");

      //NOTE Attributes
      this.setAttribute("element-type", "Link");
      this.setAttribute("element-name", "container");

      elmHyperLink.setAttribute("element-type", "Link");
      // elmHyperLink.setAttribute("element-name", "text");

      this.setAttribute("label-type", "");

      this.text = text;
      // if (instanceOf(text, String)) {
      //     elmHyperLink.innerHTML = text;
      // }
      if (instanceOf(url, String)) {
        elmHyperLink.href = url;
      }

      //NOTE Append Children
      this.addControl(elmHyperLink);

      //NOTE Public Properties
      /**
       * @member {string}
       */
      Object.defineProperty(this, "url", {
        enumerable: true,
        configurable: true,
        get: function() {
          return elmHyperLink.href;
        },

        set: function(v) {
          if (instanceOf(v, String)) {
            elmHyperLink.href = v;
          }
        }
      });

      delete this.addControl;

      elmHyperLink.addEventListener(
        "click",
        function(e) {
          if (!(this.enabled && this.visible)) {
            e.preventDefault();
          }
        }.bind(this),
        true
      );
    }
  },
  BText,
  BLabel
);
