/**
 * Created by samir on 11/11/16.
 */

("use strict");


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
    init: function (parent, hrLine, vertical, theme) {
        this.super(parent, theme);

        this.setAttribute("element-type", "Spacer");
        this.setAttribute("element-name", "container");

        this.setAttribute("horizontal-line", ((hrLine === true) ? "true" : "false"));
        this.setAttribute("vertical", ((vertical === true) ? "true" : "false"));

        // if (hrLine === true) {
        //     var elmHr = document.createElement("hr");
        //     this.addControl(elmHr);

        //     elmHr.setAttribute("element-type", "Spacer");
        //     elmHr.setAttribute("element-name", "hr");
        // }

        delete this.headText;
        delete this.footText;
        delete this.addControl;
    },
});