/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @property {string} text
 * @property {source} Tigerian.Control
 * @property {boolean} visible
 *
 * @extends Tigerian.Control
 * @constructor
 */
Tigerian.Container = Tigerian.Control.extend({
    /**
     * @param {Tigerian.UI} parent
     * @param {string} theme
     */
    init: function (parent, theme) {
        this.super(parent, theme);


        //TODO Private Variables
        var elmBody = document.createElement("div");
        var thisAddControl = this.addControl;


        //TODO Attributes
        this.setAttribute("element-type", "Container");
        this.setAttribute("element-name", "container");

        elmBody.setAttribute("element-type", "Container");
        elmBody.setAttribute("element-name", "body");
        elmBody.className = this.theme;


        //TODO Append Children
        thisAddControl(elmBody);

        this.addControl = function (control) {
            if (Tigerian.Class.isInstance(control, Element)) {
                elmBody.appendChild(control);
            } else if (Tigerian.Class.isInstance(control, Tigerian.Control)) {
                control.appendTo(this, elmBody);
            }
        };
    }
});
