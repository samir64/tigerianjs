"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BCascade}
 */
Tigerian.CollapseItem = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.Control} parent
     * @param {string} text
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        this.super(parent, theme);

        var elmText = document.createElement("div");
        var ctrlList = new Tigerian.CollapseList(null, this.theme);
        var superAddControl = this.addControl.bind(this);

        this.config("text", elmText);
        this.config("cascade");

        var superAddChild = this.addChild.bind(this);
        var canChangeChildState = true;
        var touchStarted = false;
        var instance = this;

        superAddControl(elmText);

        this.text = text;

        this.setAttribute("element-type", "CollapseItem");
        this.setAttribute("element-name", "container");

        elmText.setAttribute("element-type", "CollapseItem");
        elmText.setAttribute("element-name", "text");

        this.addControl = this.addChild = this.addSublist = function (item) {
            if (Tigerian.Class.isInstance(item, Tigerian.CollapseItem) || Tigerian.Class.isInstance(item, Tigerian.Spacer)) {
                if (!this.hasSubmenu) {
                    superAddChild(ctrlList);
                }
                ctrlList.addControl(item);
            }
        };

        elmText.addEventListener("click", function (e) {
            if (canChangeChildState && !touchStarted) {
                instance.viewChild();
                canChangeChildState = false;
            }

            setTimeout(function () {
                canChangeChildState = true;
            }, 100);
        });

        elmText.addEventListener("touchstart", function (e) {
            if (canChangeChildState) {
                touchStarted = true;
            }
        });

        elmText.addEventListener("touchend", function (e) {
            if (canChangeChildState && touchStarted) {
                instance.viewChild();
                canChangeChildState = false;
                touchStarted = true;
            }

            setTimeout(function () {
                canChangeChildState = true;
            }, 100);
        });

        this.addControl(elmText);
    },
}, Tigerian.BText, Tigerian.BCascade);