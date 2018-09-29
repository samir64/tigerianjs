"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 */
Tigerian.Table = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {number} colCount = 1
     * @param {string} caption = ""
     * @param {string} theme = ""
     */
    init: function (parent, colCount, caption, theme) {
        this.super(parent, theme);

        if (Tigerian.Class.isInstance(colCount, "number")) {
            colCount = Math.max(1, colCount);
        } else {
            colCount = 1;
        }

        var ctrlTableHeader = new Tigerian.Header(this, false, this.theme);
        var ctrlTableBody = new Tigerian.TableBody(this, this.theme);
        var ctrlTableFooter = new Tigerian.Footer(this, false, this.theme);

        var ctrlCaption = new Tigerian.Label(ctrlTableHeader, "", this.theme);
        var ctrlHeadRow = new Tigerian.TableRow(ctrlTableHeader, colCount, this.theme);

        this.config("group", ctrlTableBody);

        var instance = this;
        var superAddControl = this.addControl.bind(this);
        var superGetItem = this.getItem.bind(this);

        ctrlCaption.text = caption;

        var onMouseOver = function (e) {
            this.parent.setAttribute("hover", "true");
            for (var r = 0; r < instance.rowCount; r++) {
                for (var c = 0; c < instance.colCount; c++) {
                    var cell = instance.getCell(r, c);
                    cell.setAttribute("hover", ((parseInt(this.getAttribute("column-number")) === c) ? "true" : "false"));
                    // cell.setAttribute("hover", (((this.parent === cell.parent) || (parseInt(this.getAttribute("column-number")) === c)) ? "true" : "false"));
                }
            }
        };

        var onMouseLeave = function (e) {
            this.parent.setAttribute("hover", "false");
            for (var r = 0; r < instance.rowCount; r++) {
                for (var c = 0; c < instance.colCount; c++) {
                    var cell = instance.getCell(r, c);
                    cell.setAttribute("hover", "false");
                }
            }
        };

        this.setAttribute("element-type", "Table");
        this.setAttribute("element-name", "container");

        /**
         * @member {number}
         */
        Object.defineProperty(this, "rowCount", {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.itemCount;
            },
        });

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
        /**
         * @member {string}
         */
        Object.defineProperty(this, "caption", {
            enumerable: true,
            configurable: true,
            get: function () {
                return ctrlCaption.text;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    ctrlCaption.text = v;
                }
            },
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "captionVisible", {
            enumerable: true,
            configurable: true,
            get: function () {
                return ctrlCaption.visible;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    ctrlCaption.visible = v;
                }
            },
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "footerVisible", {
            enumerable: true,
            configurable: true,
            get: function () {
                return ctrlTableFooter.visible;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    ctrlTableFooter.visible = v;
                }
            },
        });

        /**
         * @param {number} col 
         * @param {boolean} visible 
         */
        this.columnVisible = function (col, visible) {
            this.getHeadCell(col).visible = visible;
            for (var i = 0; i < this.rowCount; i++) {
                this.getCell(i, col).visible = visible;
            }
        };

        this.addControl = this.addItem = this.addRow = function () {
            var newRow = new Tigerian.TableRow(null, colCount, this.theme);

            newRow.setAttribute("hover", "false");

            for (var i = 0; i < colCount; i++) {
                newRow.getCell(i).addEvent("mouseover", onMouseOver);
                newRow.getCell(i).addEvent("mouseleave", onMouseLeave);
            }

            superAddControl.bind(this)(newRow);
        };

        /**
         * @param {number} row
         * @param {number} col
         * @returns {Tigerian.TableCell}
         */
        this.getItem = this.getCell = function (row, col) {
            return superGetItem(row).getItem(col);
        };

        /**
         * @param {number} col
         * @returns {Tigerian.TableCell}
         */
        this.getHeadCell = function (col) {
            return ctrlHeadRow.getItem(col);
        };

        this.removeRow = this.removeItem;
    },
}, Tigerian.BGroup);