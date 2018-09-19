/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @class
 * @extends {Tigerian.Control}
 */
Tigerian.Field = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} [label = ""]
     * @param {string} [text = ""]
     * @param {string} [theme = ""]
     */
    init: function (parent, label, text, theme) {
        this.super(parent, theme);

        var ctrlLabel = new Tigerian.Label(this, label, null, theme);
        var ctrlText = new Tigerian.TextBox(this, text, theme);

        this.config("text", ctrlText);


        ctrlLabel.source = ctrlText;

        //NOTE Attributes
        this.setAttribute("element-type", "Field");
        this.setAttribute("element-name", "container");

        this.setAttribute("empty", (ctrlText.text === "") ? "true" : "false");

        ctrlLabel.source = ctrlText;

        /**
         * @member {Tigerian.Label}
         */
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            get: function () {
                // return ctrlLabel;
                return ctrlLabel.headText;
            },
            set: function (value) {
                ctrlLabel.text = value;
            },

        });


        //NOTE Private Functions
        function onClick(e) {
            ctrlText.select();
        }

        function onChange(e) {
            this[0].setAttribute("empty", (this[1].text === "") ? "true" : "false");
        }

        function onFocus(e) {
            this.setAttribute("focused", "true");
        }

        function onBlur(e) {
            this.setAttribute("focused", "false");
        }

        //NOTE Public Functions
        this.select = function () {
            ctrlText.select();
        };


        //NOTE Default Event
        ctrlLabel.addEvent("click", onClick);
        ctrlText.addEvent("input", onChange.bind([this, ctrlText]));
        ctrlText.addEvent("focus", onFocus.bind(this));
        ctrlText.addEvent("blur", onBlur.bind(this));
    }
}, Tigerian.BText);