/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */

'use strict';


/**
 * @param {Element} element
 *
 * @property {boolean} enabled
 * @property {boolean} visible
 * @property {boolean} autoVisible
 * @property {string} style
 *
 * @constructor
 * @extends Tigerian
 */
Tigerian.Application = Tigerian.UI.extend({
    /**
     * @param {Function} superClass
     * @param {Element} element
     */
    init: function (element, theme) {
        this.super(element, null, theme);

        //NOTE Attributes
        this.setAttribute("element-name", "main");
        this.setAttribute("element-type", "Application");
        this.setAttribute("enabled", "true");
        this.setAttribute("visible", "true");
    }
});
