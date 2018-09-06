/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @param {string} text
 * @param {string} url
 * @param {string} [style = ""]
 * @param {Tigerian.Application|Tigerian.Control} [parent = undefined]
 * @param {Function|Function[]} interfaces
 *
 * @property {string} text
 * @property {string} url
 *
 * @extends Tigerian.Control
 * @constructor
 */
Tigerian.HyperLink = Tigerian.Control.extend({
    init: function (parent, text, url, theme) {
        this.super(parent, theme);


        //TODO Private Variables
        var elmHyperLink = document.createElement("a");


        //TODO Attributes
        this.setAttribute("element-type", "Link");
        this.setAttribute("element-name", "container");

        elmHyperLink.setAttribute("element-type", "Link");
        elmHyperLink.setAttribute("element-name", "link");
        if (Tigerian.Class.isInstance(text, "string")) {
            elmHyperLink.innerHTML = text;
        }
        if (Tigerian.Class.isInstance(url, "string")) {
            elmHyperLink.href = url;
        }


        //TODO Append Children
        this.addControl(elmHyperLink);


        //TODO Public Properties
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
