/**
 * Created by samir on 09/20/18.
 */

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BFixElement}
 */
Footer = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, fixed, theme) {
        this.super(parent, theme);
        this.config("fix_element", BFixElement.EBottom);

        this.fixed = fixed;

        this.setAttribute("element-type", "Footer");
        this.setAttribute("element-name", "container");
    },
}, BFixElement);