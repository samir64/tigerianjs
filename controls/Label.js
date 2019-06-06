/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BText}
 * @implements {Tigerian.BLabel}
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
        var elmFormatText;
        var formatTextRenew = true;

        this.super(parent, theme);
        this.config("text", elmLabel);
        this.config("label");


        var initText = Object.getOwnPropertyDescriptor(this, "text");

        //NOTE Private Variables
        var source;


        //NOTE Attributes
        this.setAttribute("element-type", "Label");
        this.setAttribute("element-name", "container");

        elmLabel.setAttribute("element-type", "Label");
        // elmLabel.setAttribute("element-name", "text");

        this.setAttribute("inline-mode", "false");

        // if (Tigerian.Class.isInstance(text, "string")) {
        //     elmLabel.innerHTML = text;
        // }

        this.text = text;


        //NOTE Append Children
        this.addControl(elmLabel);

        var createFormatText = function () {
            if (formatTextRenew) {
                elmFormatText = document.createElement("div");

                elmFormatText.setAttribute("element-type", "Label");
                elmFormatText.setAttribute("element-name", "text");

                formatTextRenew = false;
            }
        };


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
            set: function (v) {
                if (Tigerian.Class.isInstance(v, Tigerian.Control)) {
                    source = v;
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "inline", {
            enumerable: true,
            configurable: true,
            /**
             * @returns {boolean}
             */
            get: function () {
                return (this.getAttribute("inline-mode") === "true");
            },
            /**
             * @param {boolean} v = false
             */
            set: function (v) {
                if (v === true) {
                    this.setAttribute("inline-mode", "true");
                } else {
                    this.setAttribute("inline-mode", "false");
                }
            }
        });

        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            get: initText.get.bind(this),
            set: function (v) {
                elmFormatText.remove();
                createFormatText();
                initText.set.bind(this)(v);
            },
        });

        /**
         * @param {string} text
         * @param {Tigerian.Control[]} ...controls
         */
        this.format = function (text, controls) {
            if (Tigerian.Class.isInstance(text, "string")) {
                var lastIndex = 0;
                var pat = /@/g;
                var i = 0;

                controls = Array.from(arguments).slice(1);

                formatTextRenew = true;
                this.text = "";
                this.addControl(elmFormatText);

                while ((pat.exec(text) != null) && (i < controls.length)) {
                    if (text[pat.lastIndex - 2] !== "\\") {
                        if (Tigerian.Class.isInstance(controls[i], Tigerian.Control)) {
                            var subText = text.substr(lastIndex, pat.lastIndex - lastIndex - 1).replace("\\@", "@");
                            var textNode = document.createTextNode(subText);
                            elmFormatText.appendChild(textNode);
                            controls[i].parent = elmFormatText;
                            lastIndex = pat.lastIndex;
                        }
                        i++;
                    }
                }

                var textNode = document.createTextNode(text.substr(lastIndex).replace("\\@", "@"));
                elmFormatText.appendChild(textNode);
            }
        };

        elmLabel.addEventListener("click", function (e) {
            if (source) {
                source.select();
            }
        }, true);

        // delete this.addControl;
        createFormatText();
    },
    enums: []
}, Tigerian.BText, Tigerian.BLabel);