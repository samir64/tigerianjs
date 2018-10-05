"use strict";

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 */
Tigerian.BTable = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("table");

    },
    /**
     * @param {string} behavior
     * @param {number} colCount
     * @param {boolean} autoAddRow
     * @param {Tigerian.Control} ctrlTableBody
     */
    config: function (behavior, colCount, ctrlTableBody) {
        if ((behavior === "table") && Tigerian.Class.isInstance(this, Tigerian.Control) && this["Behavior:table"] && Tigerian.Class.isInstance(ctrlTableBody, Tigerian.Control) && ctrlTableBody["Behavior:group"]) {
            if (Tigerian.Class.isInstance(colCount, "number")) {
                colCount = Math.max(1, colCount);
            } else {
                colCount = 1;
            }

            var ctrlTableHeader = new Tigerian.Header(this, false, this.theme);
            this.addControl(ctrlTableBody);
            var ctrlTableFooter = new Tigerian.Footer(this, false, this.theme);

            var ctrlCaption = new Tigerian.Label(ctrlTableHeader, "", this.theme);
            var ctrlHeadRow = new Tigerian.TableRow(ctrlTableBody, colCount, this.theme);

            var ctrlNavigate = new Tigerian.Control(ctrlTableFooter, this.theme);
            var ctrlPrev = new Tigerian.Button(ctrlNavigate, "«", this.theme);
            var ctrlPage = new Tigerian.Label(ctrlNavigate, "0 / 0", this.theme);
            var ctrlNext = new Tigerian.Button(ctrlNavigate, "»", this.theme);
            var ctrlRowCount = new Tigerian.Label(ctrlTableFooter, "Rows: 0", this.theme);

            ctrlNavigate.setAttribute("element-type", "DataTable");
            ctrlNavigate.setAttribute("element-name", "navigation");

            this.setAttribute("view-mode", "list");

            ctrlNavigate.normalColumn = 6;
            ctrlPrev.normalColumn = 4;
            ctrlPage.normalColumn = 4;
            ctrlNext.normalColumn = 4;
            ctrlRowCount.normalColumn = 6;
            ctrlPage.align = Tigerian.Control.ECenter;
            ctrlRowCount.align = Tigerian.Control.ERight;

            var instance = this;
            var superAddItem = ctrlTableBody.addItem.bind(this);
            var superGetItem = ctrlTableBody.getItem.bind(this);
            var superClear = ctrlTableBody.clear.bind(this);
            var superRemoveItem = ctrlTableBody.removeItem.bind(this);
            var ctrlTableBodyStyle = Object.getOwnPropertyDescriptor(ctrlTableBody, "style");

            var pageSize = Tigerian.BTable.EUnlimit;
            var pageNo = 0;
            var rowCount = 0;

            var visibleRows = function () {
                pageNo = Math.max(1, Math.min(pageNo, instance.pageCount));
                var pageTop = ((instance.pageSize === Tigerian.BTable.EUnlimit) ? 0 : (pageNo - 1) * instance.pageSize);

                if (ctrlTableBody.itemCount - 1 !== pageSize) {
                    var ps = pageSize;
                    if (ps === Tigerian.BTable.EUnlimit) {
                        ps = rowCount;
                    }

                    if (ctrlTableBody.itemCount > ps + 1) {
                        for (i = ps + 1; i < ctrlTableBody.itemCount;) {
                            ctrlTableBody.removeItem(i);
                        }
                    } else {
                        for (i = ctrlTableBody.itemCount; i <= ps; i++) {
                            addRow(false);
                        }
                    }
                }

                for (var i = 1;
                    ((instance.pageSize === Tigerian.BTable.EUnlimit) || (i <= pageSize)) && (i < ctrlTableBody.itemCount); i++) {
                    superGetItem(i).visible = (pageSize === Tigerian.BTable.EUnlimit) || (i - 1 < rowCount - pageTop);
                }
            };

            var refreshView = function () {
                pageNo = Math.max(1, Math.min(pageNo, instance.pageCount));
                // pageNo = Math.max(((rowCount > 0) ? 1 : 0), Math.min(pageNo, instance.pageCount));
                var pageTop = ((instance.pageSize === Tigerian.BTable.EUnlimit) ? 0 : (pageNo - 1) * instance.pageSize);
                ctrlNavigate.visible = (pageSize !== Tigerian.BTable.EUnlimit);

                ctrlPage.text = "{} / {}".format(pageNo, instance.pageCount);
                ctrlRowCount.text = "Rows: {}".format(rowCount);

                visibleRows();

                for (var i = 1;
                    ((instance.pageSize === Tigerian.BTable.EUnlimit) || (i <= pageSize)) && (i < ctrlTableBody.itemCount); i++) {
                    switch (instance.viewMode) {
                        case Tigerian.BTable.EListView:
                            for (var c = 0; c < colCount; c++) {
                                instance.getCell(i - 1, c).headText = "";
                                instance.getHeadCell(c).unbind("text", instance.getCell(i - 1, c), "headText");
                            }
                            break;

                        case Tigerian.BTable.EDetailsView:
                            for (var c = 0; c < colCount; c++) {
                                if (instance.getHeadCell(c).text) {
                                    instance.getCell(i - 1, c).headText = instance.getHeadCell(c).text + ": ";
                                }
                                instance.getHeadCell(c).bind("text", instance.getCell(i - 1, c), "headText", function (value) {
                                    if ((value === "") || (value === undefined)) {
                                        return "";
                                    } else {
                                        return "{}: ".format(value);
                                    }
                                });
                            }
                            break;

                        default:
                    }
                }
            };

            var onMouseOver = function (e) {
                this.parent.setAttribute("hover", "true");
                for (var r = 0; r < ((pageSize === Tigerian.BTable.EUnlimit) ? rowCount : pageSize); r++) {
                    for (var c = 0; c < colCount; c++) {
                        var cell = instance.getCell(r, c);
                        cell.setAttribute("hover", ((parseInt(this.getAttribute("column-number")) === c) ? "true" : "false"));
                        // cell.setAttribute("hover", (((this.parent === cell.parent) || (parseInt(this.getAttribute("column-number")) === c)) ? "true" : "false"));
                    }
                }
            };

            var onMouseLeave = function (e) {
                this.parent.setAttribute("hover", "false");
                for (var r = 0; r < ((pageSize === Tigerian.BTable.EUnlimit) ? rowCount : pageSize); r++) {
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
                    if (Tigerian.Class.isInstance(v, "number") || (v === Tigerian.BTable.EUnlimit)) {
                        pageSize = ((v > 0) ? v : Tigerian.BTable.EUnlimit);
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
                    if (pageSize !== Tigerian.BTable.EUnlimit) {
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
                        inst
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
             * @member {boolean}
             */
            Object.defineProperty(this, "viewMode", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return ((this.getAttribute("view-mode") === "list") ? Tigerian.BTable.EListView : ((this.getAttribute("view-mode") === "details") ? Tigerian.BTable.EDetailsView : undefined));
                },
                set: function (v) {
                    switch (v) {
                        case Tigerian.BTable.EListView:
                            this.setAttribute("view-mode", "list");
                            refreshView();
                            break;

                        case Tigerian.BTable.EDetailsView:
                            this.setAttribute("view-mode", "details");
                            refreshView();
                            break;

                        default:
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

            /**
             * @param {boolean} refresh = true
             */
            var addRow = function (refresh) {
                var newRow = new Tigerian.TableRow(null, colCount, instance.theme);

                newRow.setAttribute("hover", "false");

                for (var i = 0; i < colCount; i++) {
                    newRow.getCell(i).addEvent("mouseover", onMouseOver);
                    newRow.getCell(i).addEvent("mouseleave", onMouseLeave);
                }

                superAddItem(newRow);

                if (refresh !== false) {
                    refreshView();
                }
            };

            this.addRow = function () {
                this.rowCount++;
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

            this.clear = function () {
                ctrlTableBody.clear();
                ctrlTableBody.addControl(ctrlHeadRow);
                refreshView();
            };

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
                    ctrlTableBody.clear();
                    ctrlTableBody.addControl(ctrlHeadRow);
                    visibleRows();
                    instance.dispatchEvent(Tigerian.Event.onNextPage);
                    instance.dispatchEvent(Tigerian.Event.onPageChanged);
                }
            });

            ctrlPrev.addEvent("click", function (e) {
                var lastPageNo = pageNo;
                instance.pageNumber--;
                refreshView();
                if (lastPageNo !== pageNo) {
                    ctrlTableBody.clear();
                    ctrlTableBody.addControl(ctrlHeadRow);
                    visibleRows();
                    instance.dispatchEvent(Tigerian.Event.onPreviousPage);
                    instance.dispatchEvent(Tigerian.Event.onPageChanged);
                }
            });

            refreshView();

            delete this.addControl;
            delete this.addItem;
            delete this.removeItem;
            // delete this.clear;
        }
    },
    enums: ["unlimit", "listView", "detailsView"],
});