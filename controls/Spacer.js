/**
 * Created by samir on 11/11/16.
 */

"use strict";


/**
 * @extends {Tigerian.Control}
 * @constructor
 */
Tigerian.Spacer = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {boolean} [hrLine = false]
     * @param {string} [theme = ""]
     */
    init: function (parent, hrLine, theme) {
        this.super(parent, theme);

        if (hrLine === true) {
            var elmHr = document.createElement("hr");
            this.addControl(elmHr);

            elmHr.setAttribute("element-type", "Spacer");
            elmHr.setAttribute("element-name", "hr");
        }

        this.setAttribute("element-type", "Spacer");
        this.setAttribute("element-name", "container");

        delete this.headText;
        delete this.footText;
        delete this.addControl;
    },
});