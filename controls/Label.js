/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @extends {Tigerian.Control}
 * @class
 */
Tigerian.Label = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} text = ""
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        var elmLabel = document.createElement("div");

        this.super(parent, theme);
        this.config("text", elmLabel);
        this.config("label");


        //NOTE Private Variables
        var source;


        //NOTE Attributes
        this.setAttribute("element-type", "Label");
        this.setAttribute("element-name", "container");

        elmLabel.setAttribute("element-type", "Label");
        elmLabel.setAttribute("element-name", "text");

        // if (Tigerian.Class.isInstance(text, "string")) {
        //     elmLabel.innerHTML = text;
        // }

        this.text = text;


        //NOTE Append Children
        this.addControl(elmLabel);


        //NOTE Properties
        /**
         * @member {Tigerian.Control}
         */
        Object.defineProperty(this, "source", {
            enumerable: true,
            configurable: true,
            get: function () {
                return source;
            },
            set: function (value) {
                if (Tigerian.Class.isInstance(value, Tigerian.Control)) {
                    source = value;
                }
            }
        });

        elmLabel.addEventListener("click", function (e) {
            if (source) {
                source.select();
            }
        }, true);

        delete this.addControl;
    },
    enums: []
}, Tigerian.BText, Tigerian.BLabel);