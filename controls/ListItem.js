/**
 * Created by samir on 11/7/16.
 */

("use strict");


/**
 * @extends {Label}
 * @implements {BSelect}
 * @implements {BText}
 * @constructor
 */
ListItem = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} text
     * @param {string} [theme = ""]
     */
    init: function (parent, text, theme) {
        var elmItem = document.createElement("div");

        this.super(parent, theme);
        this.config("select");
        this.config("text", elmItem);

        this.addControl(elmItem);

        // if (Class.isInstance(text, "string")) {
        //     elmItem.innerHTML = text;
        // }
        this.text = text;

        //NOTE Attributes
        this.setAttribute("element-type", "ListItem");
        this.setAttribute("element-name", "container");

        elmItem.setAttribute("element-type", "ListItem");
        elmItem.setAttribute("element-name", "item");

        // Object.defineProperty(this, "text", {
        //     enumerable: true,
        //     configurable: true,
        //     get: function () {
        //         return elmItem.innerHTML;
        //     },
        //     set: function (v) {
        //         if (Class.isInstance(v, "string")) {
        //             elmItem.innerHTML = v;
        //         }
        //     },
        // });
    }
}, BSelect, BText);