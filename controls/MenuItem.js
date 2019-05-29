"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BText}
 * @implements {Tigerian.BCascade}
 */
Tigerian.MenuItem = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} text
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        this.super(parent, theme);

        var elmText = document.createElement("div");
        var ctrlMenu = new Tigerian.Menu(null, this.theme);
        var superAddControl = this.addControl.bind(this);

        this.config("text", elmText);
        this.config("cascade");

        var superAddChild = this.addChild.bind(this);
        var canChangeChildState = true;
        var touchStarted = false;
        var openByClick = false;

        var instance = this;

        superAddControl(elmText);
        this.text = text;
        this.hoverable = true;

        this.setAttribute("element-type", "MenuItem");
        this.setAttribute("element-name", "container");

        elmText.setAttribute("element-type", "MenuItem");
        // elmText.setAttribute("element-name", "text");

        /**
         * @param {Tigerian.MenuItem|Tigerian.Spacer} item
         */
        this.addControl = this.addChild = this.addSubmenu = function (item) {
            if (Tigerian.Class.isInstance(item, Tigerian.MenuItem) || Tigerian.Class.isInstance(item, Tigerian.Spacer)) {
                if (!this.hasSubmenu) {
                    superAddChild(ctrlMenu);
                }
                ctrlMenu.addControl(item);
            }
        };

        this.addEvent("mouseover", function (e) {
            if (canChangeChildState && !touchStarted) {
                instance.viewChild(true);
            }
        });
        this.addEvent("mouseleave", function (e) {
            if (canChangeChildState && !touchStarted) {
                instance.viewChild(false);
            }
        });

        elmText.addEventListener("touchstart", function (e) {
            if (canChangeChildState) {
                touchStarted = true;
            }
        });

        elmText.addEventListener("touchend", function (e) {
            if (canChangeChildState && touchStarted && (document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY) === e.changedTouches[0].target)) {
                instance.viewChild();
                canChangeChildState = false;
                touchStarted = false;
            }

            setTimeout(function () {
                canChangeChildState = true;
            }, 100);
        });
    },
}, Tigerian.BText, Tigerian.BCascade);