("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BGroup}
 */
CollapseList = Control.extend({
    /**
     * @constructs
     * @param {Control} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("group");

        var superAddItem = this.addItem.bind(this);

        this.setAttribute("element-type", "CollapseList");
        this.setAttribute("element-name", "container");

        this.normalColumn = BWindow.ENone;

        this.addControl = this.addItem = function (item) {
            if (Class.isInstance(item, CollapseItem)) {
                superAddItem(item);
            }
        };

        this.collapseAll = function () {
            for (var i = 0; i < this.itemCount; i++) {
                this.getItem(i).collapse();
            }
        };

        this.expandAll = function () {
            for (var i = 0; i < this.itemCount; i++) {
                this.getItem(i).expand();
            }
        };
    },
}, BGroup);