"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BGroup}
 */
Tigerian.MainMenu = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} theme
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("group");

        var superAddControl = this.addControl.bind(this);
        var superAddItem = this.addItem.bind(this);

        this.setAttribute("element-type", "MainMenu");
        this.setAttribute("element-name", "container");

        this.setAttribute("absolute", ((this.absolutePosition === true) ? "true" : "false"));

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "absolutePosition", {
            enumerable: true,
            configurable: true,
            get: function () {
                return (this.getAttribute("absolute") === "true");
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    this.setAttribute("absolute", (v ? "true" : "false"));
                }
            },
        });

        /**
         * @param {Tigeriam.MenuItem} item
         */
        this.addControl = this.addItem = function (item) {
            if (Tigerian.Class.isInstance(item, Tigerian.MenuItem)) {
                superAddItem(item);
            }
        };
    },
}, Tigerian.BGroup);