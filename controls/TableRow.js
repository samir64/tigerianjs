("use strict");

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BGroup}
 */
Tigerian.TableRow = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {number} colCount = 1
     * @param {string} theme = ""
     */
    init: function (parent, colCount, theme) {
        this.super(parent, theme);
        this.config("group");

        var superAddControl = this.addControl.bind(this);
        var superGetItem = this.getItem.bind(this);

        this.setAttribute("element-type", "TableRow");
        this.setAttribute("element-name", "container");

        if (Tigerian.Class.isInstance(colCount, "number")) {
            colCount = Math.max(1, colCount);
        } else {
            colCount = 1;
        }

        /**
         * @member {number}
         */
        Object.defineProperty(this, "colCount", {
            enumerable: true,
            configurable: true,
            get: function () {
                return colCount;
            },
        });


        for (var i = 0; i < colCount; i++) {
            var newCell = new Tigerian.TableCell(this, "", this.theme);
            newCell.setAttribute("column-number", i.toString());
            newCell.setAttribute("hover", false);
            // newCell.normalColumn = ((colCount <= 12) ? Math.floor(12 / colCount) : 1);
        }

        this.getCell = this.getItem;

        delete this.removeItem;
        delete this.addControl;
        delete this.addItem;
    },
}, Tigerian.BGroup);