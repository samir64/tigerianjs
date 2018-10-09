/**
 * Created by samir on 11/11/16.
 */

"use strict";


/**
 * @extends {Tigerian.Control}
 * @constructor
 */
Tigerian.ComboBox = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {string} [theme = ""]
     * @param {Tigerian.UI} parent
     */
    init: function (parent, theme) {
        this.super(parent, theme);

        var ctrlLabel = new Tigerian.Label(this, "", theme);
        var ctrlText = new Tigerian.TextBox(this, "", theme);
        var ctrlList = new Tigerian.ListBox(this, theme);

        this.config("group", ctrlList);
        this.config("filter", ctrlText, ctrlList);
        this.config("text", ctrlText);

        //Note Private Variables
        var editable = false;
        var instance = this;
        var superAddControl = this.addControl.bind(this);
        var selectRequire = false;
        var canChangeVisible = true;

        ctrlText.hoverable = ctrlLabel.hoverable = true;

        //NOTE Attributes
        this.setAttribute("element-type", "ComboBox");
        this.setAttribute("element-name", "container");
        // ctrlLabel.setAttribute("element-name", "label");
        // ctrlText.setAttribute("element-name", "Text");
        // ctrlList.setAttribute("element-name", "list");

        //NOTE Private Functions
        var showList = function (e) {
            if (canChangeVisible) {
                instance.filter("");
                ctrlList.visible = true;

                canChangeVisible = false;
            }

            setTimeout(function () {
                canChangeVisible = true;
            }, 20);
        };

        var hideList = function (e) {
            if (canChangeVisible) {
                ctrlList.visible = false;
                if (selectRequire) {
                    if (ctrlList.selectedIndex >= 0) {
                        ctrlLabel.text = ctrlList.getItem(ctrlList.selectedIndex).text;
                        instance.text = ctrlList.getItem(ctrlList.selectedIndex).text;
                    } else {
                        ctrlLabel.text = "";
                        ctrlText.text = "";
                    }
                } else {
                    if ((ctrlList.selectedIndex >= 0) && (ctrlList.getItem(ctrlList.selectedIndex).text !== ctrlText.text)) {
                        ctrlList.selectedIndex = -1;
                    }
                }

                canChangeVisible = false;
            }

            setTimeout(function () {
                canChangeVisible = true;
            }, 20);
        };

        var show_hideList = function (e) {
            if (ctrlList.visible) {
                hideList(e);
            } else {
                showList(e);
            }
        };

        var onSelectedIndexChange = function (e) {
            if (ctrlList.selectedIndex >= 0) {
                ctrlLabel.text = ctrlList.getItem(ctrlList.selectedIndex).text;
                instance.text = ctrlList.getItem(ctrlList.selectedIndex).text;
            } else {
                ctrlLabel.text = instance.text = "";
            }
            ctrlList.visible = false;
        };

        //NOTE Properties
        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "editable", {
            enumerable: true,
            configurable: true,
            get: function () {
                return editable;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    editable = v;

                    ctrlText.visible = v;
                    ctrlLabel.visible = !v;
                    ctrlList.visible = false;

                    this.filtering = v;
                }
            }
        });

        /**
         * @member {number}
         */
        Object.defineProperty(this, "selectedIndex", {
            enumerable: true,
            configurable: true,
            get: function () {
                return ctrlList.selectedIndex;
            },
            set: function (v) {
                ctrlList.selectedIndex = v;
            },
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "selectRequire", {
            enumerable: true,
            configurable: true,
            get: function () {
                return selectRequire;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    selectRequire = v;
                }
            },
        });

        //NOTE Public Functions
        /**
         * @param {Tigerian.ListItem|string} item
         */
        this.addControl = this.addItem = function (item) {
            if (Tigerian.Class.isInstance(item, "string")) {
                item = new Tigerian.ListItem(null, item, this.theme);
            } else if (!(Tigerian.Class.isInstance(item, Tigerian.Control) && item["Behavior:select"])) {
                item = new Tigerian.ListItem(null, "Item " + (this.itemCount + 1).toString(), this.theme);
            }

            item.autoDeselect = this.multiSelect;
            superAddControl(item);
        };

        //NOTE Constructor Statement
        ctrlText.visible = false;
        ctrlList.visible = false;

        //NOTE Events
        window.addEventListener("click", function (e) {
            if (!(instance.editable && ctrlText.focused) && ctrlList.visible) {
                hideList();
                // } else if (!ctrlList.visible) {
                //     showList(e);
            }
        }, true);
        ctrlLabel.addEvent("click", show_hideList);
        ctrlText.addEvent("focus", showList);
        ctrlText.addEvent("blur", function (e) {
            setTimeout(hideList, 150);
        });
        ctrlText.addEvent("click", function (e) {
            if (ctrlText.focused && !ctrlList.visible) {
                showList(e);
            }
        });
        ctrlText.addEvent("keydown", function (e) {
            if ((e.code === "Enter") || (e.code === "Escape")) {
                hideList(e);
            } else if (!ctrlList.visible) {
                showList(e);
            }
        });
        ctrlList.addEvent("selectedindexchange", onSelectedIndexChange);
    },
}, Tigerian.BGroup, Tigerian.BFilter, Tigerian.BText);