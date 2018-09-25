"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BText}
 */
Tigerian.MenuItem = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} text
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        var elmText = document.createElement("div");

        this.super(parent, theme);
        this.config("text", elmText);

        var ctrlSubMenu;
        var openByClick = false;

        var instance = this;
        var superAddControl = this.addControl;

        this.text = text;

        this.addControl(elmText);

        this.setAttribute("element-type", "MenuItem");
        this.setAttribute("element-name", "container");

        elmText.setAttribute("element-type", "MenuItem");
        elmText.setAttribute("element-name", "text");

        this.setAttribute("has-submenu", "false");

        var viewSubmenu = function (visible) {
            if (instance.hasSubmenu) {
                if (Tigerian.Class.isInstance(visible, "boolean")) {
                    ctrlSubMenu.visible = visible;
                } else {
                    ctrlSubMenu.visible = !ctrlSubMenu.visible;
                }
            }
        };

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "hasSubmenu", {
            enumerable: true,
            configurable: true,
            get: function () {
                return (this.getAttribute("has-submenu") === "true");
            },
        });

        /**
         * @param {Tigerian.Menu} menu 
         */
        this.addControl = this.addSubMenu = function (menu) {
            if (Tigerian.Class.isInstance(menu, Tigerian.Menu)) {
                ctrlSubMenu = menu;
                menu.visible = false;
                this.setAttribute("has-submenu", "true");
                superAddControl(menu);
            }
        };

        this.addEvent("mouseover", function (e) {
            viewSubmenu(true);
        });
        this.addEvent("mouseleave", function (e) {
            viewSubmenu(false);
        });

        elmText.addEventListener("touchend", function (e) {
            viewSubmenu();
        });
    },
}, Tigerian.BText);