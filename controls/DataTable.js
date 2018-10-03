"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 */
Tigerian.DataTable = Tigerian.Control.extend({
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
        var ctrlHeadRow = new Tigerian.TableRow(ctrlTableBody, colCount, this.theme);

        var ctrlNavigate = new Tigerian.Control(ctrlTableFooter, this.theme);
        var ctrlPrev = new Tigerian.Button(ctrlNavigate, "«", this.theme);
        var ctrlPage = new Tigerian.Label(ctrlNavigate, "0 / 0", this.theme);
        var ctrlNext = new Tigerian.Button(ctrlNavigate, "»", this.theme);
        var ctrlRowCount = new Tigerian.Label(ctrlTableFooter, "Rows: 0", this.theme);

        this.setAttribute("element-type", "DataTable");
        this.setAttribute("element-name", "container");

        ctrlNavigate.setAttribute("element-type", "DataTable");
        ctrlNavigate.setAttribute("element-name", "navigation");

        ctrlNavigate.normalColumn = 2;
        ctrlPrev.normalColumn = 4;
        ctrlPage.normalColumn = 4;
        ctrlNext.normalColumn = 4;
        ctrlRowCount.normalColumn = 2;
        ctrlPage.align = Tigerian.Control.ECenter;

        this.config("group", ctrlTableBody);

        var instance = this;
        var superAddItem = this.addItem.bind(this);
        var superGetItem = this.getItem.bind(this);
        var superClear = this.clear.bind(this);
        var superRemoveItem = this.removeItem.bind(this);
        var ctrlTableBodyStyle = Object.getOwnPropertyDescriptor(ctrlTableBody, "style");

        var pageSize = Tigerian.DataTable.EUnlimit;
        var pageNo = 0;
        var rowCount = 0;

        ctrlCaption.text = caption;

        var refreshView = function () {
            var pageTop = ((instance.pageSize === Tigerian.DataTable.EUnlimit) ? 0 : (pageNo - 1) * instance.pageSize);
            ctrlNavigate.visible = (pageSize !== Tigerian.DataTable.EUnlimit);

            pageNo = Math.max(((rowCount > 0) ? 1 : 0), Math.min(pageNo, instance.pageCount));

            ctrlPage.text = "{} / {}".format(pageNo, instance.pageCount);
            ctrlRowCount.text = "Rows: {}".format(rowCount);

            for (var i = 1;
                ((instance.pageSize === Tigerian.DataTable.EUnlimit) || (i <= pageSize)) && (i < ctrlTableBody.itemCount); i++) {
                superGetItem(i).visible = (pageSize === Tigerian.DataTable.EUnlimit) || (i - 1 < rowCount - pageTop);
            }

            if (ctrlTableBody.itemCount !== pageSize) {
                var ps = pageSize;
                if (ps === Tigerian.DataTable.EUnlimit) {
                    ps = rowCount;
                }

                if (ctrlTableBody.itemCount > ps + 1) {
                    for (i = ps + 1; i < ctrlTableBody.itemCount; i++) {
                        ctrlTableBody.removeItem(i);
                    }
                } else {
                    for (i = ctrlTableBody.itemCount; i <= ps; i++) {
                        addRow();
                    }
                }
            }
        };

        var onMouseOver = function (e) {
            this.parent.setAttribute("hover", "true");
            for (var r = 0; r < ((pageSize === Tigerian.DataTable.EUnlimit) ? rowCount : pageSize); r++) {
                for (var c = 0; c < colCount; c++) {
                    var cell = instance.getCell(r, c);
                    cell.setAttribute("hover", ((parseInt(this.getAttribute("column-number")) === c) ? "true" : "false"));
                    // cell.setAttribute("hover", (((this.parent === cell.parent) || (parseInt(this.getAttribute("column-number")) === c)) ? "true" : "false"));
                }
            }
        };

        var onMouseLeave = function (e) {
            this.parent.setAttribute("hover", "false");
            for (var r = 0; r < ((pageSize === Tigerian.DataTable.EUnlimit) ? rowCount : pageSize); r++) {
                for (var c = 0; c < colCount; c++) {
                    var cell = instance.getCell(r, c);
                    cell.setAttribute("hover", "false");
                }
            }
        };

        Object.defineProperty(this, "style", {
            enumerable: true,
            configurable: true,
            get: ctrlTableBodyStyle.get.bind(this),
        });

        /**
         * @member {number}
         */
        Object.defineProperty(this, "rowCount", {
            enumerable: true,
            configurable: true,
            get: function () {
                return rowCount;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number")) {
                    rowCount = v;
                    refreshView();
                }
            }
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
         * @member {number}
         */
        Object.defineProperty(this, "pageSize", {
            enumerable: true,
            configurable: true,
            get: function () {
                return pageSize;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number") || (v === Tigerian.DataTable.EUnlimit)) {
                    pageSize = ((v > 0) ? v : Tigerian.DataTable.EUnlimit);
                    // this.pageNumber = pageNo;
                    refreshView();
                }
            },
        });

        /**
         * @member {number}
         */
        Object.defineProperty(this, "pageNumber", {
            enumerable: true,
            configurable: true,
            get: function () {
                return pageNo;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number")) {
                    pageNo = v;
                    refreshView();
                }
            },
        });

        /**
         * @member {number}
         */
        Object.defineProperty(this, "pageCount", {
            enumerable: true,
            configurable: true,
            get: function () {
                if (pageSize !== Tigerian.DataTable.EUnlimit) {
                    return Math.ceil(rowCount / pageSize);
                } else {
                    return ((rowCount > 0) ? 1 : 0);
                }
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
            for (var i = 0; i < pageSize; i++) {
                this.getCell(i, col).visible = visible;
            }
        };

        var addRow = function () {
            var newRow = new Tigerian.TableRow(null, colCount, instance.theme);

            newRow.setAttribute("hover", "false");

            for (var i = 0; i < colCount; i++) {
                newRow.getCell(i).addEvent("mouseover", onMouseOver);
                newRow.getCell(i).addEvent("mouseleave", onMouseLeave);
            }

            superAddItem(newRow);
        };

        /**
         * @param {number} row
         * @param {number} col
         * @returns {Tigerian.TableCell}
         */
        this.getItem = this.getCell = function (row, col) {
            return superGetItem(row + 1).getItem(col);
        };

        /**
         * @param {number} col
         * @returns {Tigerian.TableCell}
         */
        this.getHeadCell = function (col) {
            return ctrlHeadRow.getItem(col);
        };

        // this.clear = function () {
        //     superClear();
        //     refreshView();
        // };

        /**
         * @param {number} index 
         */
        // this.removeItem = function (index) {
        //     superRemoveItem(index);
        //     refreshView();
        // };

        // this.removeRow = this.removeItem;

        ctrlNext.addEvent("click", function (e) {
            var lastPageNo = pageNo;
            instance.pageNumber++;
            refreshView();
            if (lastPageNo !== pageNo) {
                instance.dispatchEvent(Tigerian.Event.onNextPage);
            }
        });

        ctrlPrev.addEvent("click", function (e) {
            var lastPageNo = pageNo;
            instance.pageNumber--;
            refreshView();
            if (lastPageNo !== pageNo) {
                instance.dispatchEvent(Tigerian.Event.onPreviousPage);
            }
        });

        refreshView();

        delete this.addControl;
        delete this.addItem;
        delete this.removeItem;
        delete this.clear;
    },
    enums: ["unlimit"],
}, Tigerian.BGroup);