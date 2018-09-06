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
Tigerian.Label = Tigerian.Control.extend({
    /**
     * @param {Tigerian.UI} parent
     * @param {string} text
     * @param {string} theme
     * @param {Tigerian.Control} source
     */
    init: function (parent, text, source, theme) {
        this.super(parent, theme);


        //TODO Private Variables
        var elmLabel = document.createElement("div");


        //TODO Attributes
        this.setAttribute("element-name", "container");
        this.setAttribute("element-type", "Label");

        elmLabel.setAttribute("element-name", "label");
        elmLabel.setAttribute("element-type", "Label");
        elmLabel.className = this.theme;
        elmLabel.style.cursor = "default";
        if (Tigerian.Class.isInstance(text, "string")) {
            elmLabel.innerHTML = text;
        }

        if (!Tigerian.Class.isInstance(source, Tigerian.Control)) {
            source = undefined;
        }


        //TODO Append Children
        this.addControl(elmLabel);


        //TODO Properties
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            get: function () {
                return elmLabel.innerHTML;
            },

            set: function (value) {
                if (Tigerian.Class.isInstance(value, "string")) {
                    elmLabel.innerHTML = value;
                }
            }
        });

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
    }
});
