/**
 * Created by samir on 8/26/16.
 */

("use strict");


/**
 * @class
 * @extends {Control}
 * @implements {BText}
 */
Field = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} [label = ""]
     * @param {string} [text = ""]
     * @param {string} [theme = ""]
     */
    init: function (parent, label, text, theme) {
        this.super(parent, theme);

        var ctrlText = new TextBox(this, text, theme);
        var ctrlLabel = new Label(this, label, theme);

        var superEnabled = Object.getOwnPropertyDescriptor(this, "enabled");

        this.config("text", ctrlText);

        ctrlLabel.source = ctrlText;
        ctrlLabel.situation = Control.ETransparent;

        //NOTE Attributes
        this.setAttribute("element-type", "Field");
        this.setAttribute("element-name", "container");

        // this.setAttribute("empty", (ctrlText.text === "") ? "true" : "false");

        ctrlLabel.source = ctrlText;

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            get: superEnabled.get.bind(this),
            set: function (v) {
                ctrlLabel.enabled = v;
                ctrlText.enabled = v;
                superEnabled.set.bind(this)(v);
            },
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            get: function () {
                // return ctrlLabel;
                return ctrlLabel.text;
            },
            set: function (v) {
                ctrlLabel.text = v;
            },

        });


        //NOTE Private Functions
        function onClick(e) {
            ctrlText.select();
        }

        // function onChange(e) {
        //     this[0].setAttribute("empty", (this[1].text === "") ? "true" : "false");
        // }

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
        // ctrlText.addEvent("input", onChange.bind([this, ctrlText]));
        ctrlText.addEvent("focus", onFocus.bind(this));
        ctrlText.addEvent("blur", onBlur.bind(this));
    }
}, BText);