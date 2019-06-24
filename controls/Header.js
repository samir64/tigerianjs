/**
 * Created by samir on 09/20/18.
 */

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BFixElement}
 */
Header = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, fixed, theme) {
        this.super(parent, theme);
        this.config("fix_element", BFixElement.ETop);

        this.fixed = fixed;

        this.setAttribute("element-type", "Header");
        this.setAttribute("element-name", "container");
    },
}, BFixElement);