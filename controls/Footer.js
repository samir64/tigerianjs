/**
 * Created by samir on 09/20/18.
 */

("use strict");

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BFixElement}
 */
Tigerian.Footer = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, fixed, theme) {
        this.super(parent, theme);
        this.config("fix_element", Tigerian.BFixElement.EBottom);

        this.fixed = fixed;

        this.setAttribute("element-type", "Footer");
        this.setAttribute("element-name", "container");
    },
}, Tigerian.BFixElement);