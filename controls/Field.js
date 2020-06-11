import {
    Control
} from "../core/Control.js";
import {
    BText
} from "../behaviors/BText.js";
import {
    TextBox
} from "./TextBox.js";
import {
    Label
} from "./Label.js";

/**
 * Created by samir on 8/26/16.
 */

("use strict");


/**
 * @class
 * @extends {Control}
 * @implements {BText}
 */
export class Field extends Control {
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} [label = ""]
     * @param {string} [text = ""]
     * @param {string} [theme = ""]
     */
    constructor(parent, label = "", text = "", theme = "") {
        super(parent, theme);

        let ctrlText = new TextBox(this, text, theme);
        let ctrlLabel = new Label(this, label, theme);

        let superEnabled = Object.getOwnPropertyDescriptor(this, "enabled");

        this.config(BText, ctrlText, text);

        ctrlLabel.source = ctrlText;
        ctrlLabel.situation = Control.ETransparent;

        //NOTE Attributes
        // this.setAttribute("element-type", "Field");
        this.setAttribute("element-name", "container");

        // this.setAttribute("empty", (ctrlText.text === "") ? "true" : "false");

        ctrlLabel.source = ctrlText;

        /**
         * @member {boolean}
         */
        this.defineProperty("enabled", {
            get: superEnabled.get.bind(this),
            set(v) {
                ctrlLabel.enabled = v;
                ctrlText.enabled = v;
                superEnabled.set.bind(this)(v);
            },
        });

        /**
         * @member {string}
         */
        this.defineProperty("label", {
            get() {
                // return ctrlLabel;
                return ctrlLabel.text;
            },
            set(v) {
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
        this.defineMethod("select", () => {
            ctrlText.select();
        });


        //NOTE Default Event
        ctrlLabel.addEvent("click", onClick);
        // ctrlText.addEvent("input", onChange.bind([this, ctrlText]));
        ctrlText.addEvent("focus", onFocus.bind(this));
        ctrlText.addEvent("blur", onBlur.bind(this));
    }
}