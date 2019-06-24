("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 * @implements {BCascade}
 */
CollapseItem = Control.extend({
    /**
     * @constructs
30⋅178     * @param {Control} parent
     * @param {string} text
     * @param {string} theme = ""
     */
    init: function (parent, text, theme) {
        this.super(parent, theme);

        var elmText = document.createElement("div");
        var ctrlList = new CollapseList(null, this.theme);
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
        // elmText.setAttribute("element-name", "text");

        this.addControl = this.addChild = this.addSublist = function (item) {
            if (Class.isInstance(item, CollapseItem) || Class.isInstance(item, Spacer)) {
                if (!this.hasSubmenu) {
                    superAddChild(ctrlList);
                }
                ctrlList.addControl(item);
            }
        };

        this.collapse = function () {
            instance.viewChild(false);
            if (instance.hasChild) {
                ctrlList.collapseAll();
            }
        };

        this.expand = function () {
            instance.viewChild(true);
            for (var i = 0; i < this.itemCount; i++) {
                ctrlList.expandAll();
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
            if (canChangeChildState && touchStarted && (document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY) === e.changedTouches[0].target)) {
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
}, BText, BCascade);