/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @extends {Tigerian.Control}
 * @constructor
 */
Tigerian.HyperLink = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} text
     * @param {string} url
     * @param {string} [theme = ""]
     */
    init: function (parent, text, url, theme) {
        this.super(parent, theme);


        //NOTE Private Variables
        var elmHyperLink = document.createElement("a");


        //NOTE Attributes
        this.setAttribute("element-type", "Link");
        this.setAttribute("element-name", "container");

        elmHyperLink.setAttribute("element-type", "Link");
        elmHyperLink.setAttribute("element-name", "link");

        this.setAttribute("tag", "false");

        if (Tigerian.Class.isInstance(text, "string")) {
            elmHyperLink.innerHTML = text;
        }
        if (Tigerian.Class.isInstance(url, "string")) {
            elmHyperLink.href = url;
        }


        //NOTE Append Children
        this.addControl(elmHyperLink);


        //NOTE Public Properties
        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "tag", {
            enumerable: true,
            configurable: true,
            get: function () {
                return (this.getAttribute("tag") === "true");
            },

            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    this.setAttribute("tag", (v ? "true" : "false"));
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmHyperLink.innerHTML;
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmHyperLink.innerHTML = value;
                }
            }
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmHyperLink.href;
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmHyperLink.href = value;
                }
            }
        });

        delete this.addControl;

        elmHyperLink.addEventListener("click", function (e) {
            if (!(this.enabled && this.visible)) {
                e.preventDefault();
            }
        }.bind(this), true);
    }
});