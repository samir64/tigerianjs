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
        if ((behavior === "table") && Tigerian.Class.isInstance(this, Tigerian.Control) && this["Behavior:table"]) {
            if (!(Tigerian.Class.isInstance(ctrlTableBody, Tigerian.Control) && ctrlTableBody["Behavior:group"] && ctrlTableBody["Behavior:table"])) {
                ctrlTableBody = this;
            }

            if (Tigerian.Class.isInstance(ctrlTableBody, Tigerian.Control) && ctrlTableBody["Behavior:group"] && ctrlTableBody["Behavior:table"]) {
                if (Tigerian.Class.isInstance(colCount, "number")) {
                    colCount = Math.max(1, colCount);
                } else {
                    colCount = 1;
                }

                // this.addControl(ctrlTableBody);

                var ctrlHeadRow = new Tigerian.TableRow(ctrlTableBody, colCount, this.theme);

                this.setAttribute("view-mode", "list");

                var instance = this;
                var superAddItem = ctrlTableBody.addItem.bind(this);
                var superGetItem = ctrlTableBody.getItem.bind(this);
                var superClear = ctrlTableBody.clear.bind(this);
                var superRemoveItem = ctrlTableBody.removeItem.bind(this);
                var ctrlTableBodyStyle = Object.getOwnPropertyDescriptor(ctrlTableBody, "style");

                var rowCount = 0;

                var refreshView = function () {
                    if (ctrlTableBody.itemCount <= rowCount) {
                        for (var i = ctrlTableBody.itemCount; i <= rowCount; i++) {
                            addRow();
                        }
                    } else {
                        rowCount = ctrlTableBody.itemCount - 1;
                    }

                    for (var i = 1;
                        (instance.pageSize === Tigerian.BTable.EUnlimit) || (i < ctrlTableBody.itemCount); i++) {
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

                var addRow = function () {
                    var newRow = new Tigerian.TableRow(null, colCount, instance.theme);

                    newRow.setAttribute("hover", "false");

                    for (var i = 0; i < colCount; i++) {
                        newRow.getCell(i).addEvent("mouseover", onMouseOver);
                        newRow.getCell(i).addEvent("mouseleave", onMouseLeave);
                    }

                    superAddItem(newRow);
                };

                var onMouseOver = function (e) {
                    this.parent.setAttribute("hover", "true");
                    for (var r = 0; r < rowCount; r++) {
                        for (var c = 0; c < colCount; c++) {
                            var cell = instance.getCell(r, c);
                            cell.setAttribute("hover", ((parseInt(this.getAttribute("column-number")) === c) ? "true" : "false"));
                            // cell.setAttribute("hover", (((this.parent === cell.parent) || (parseInt(this.getAttribute("column-number")) === c)) ? "true" : "false"));
                        }
                    }
                };

                var onMouseLeave = function (e) {
                    this.parent.setAttribute("hover", "false");
                    for (var r = 0; r < rowCount; r++) {
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
                            var lastRowCount = rowCount;
                            rowCount = v;
                            if (lastRowCount !== v) {
                                refreshView();
                            }
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
                 * @member {boolean}
                 */
                Object.defineProperty(this, "viewMode", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return ((this.getAttribute("view-mode") === "list") ? Tigerian.BTable.EListView : ((this.getAttribute("view-mode") === "details") ? Tigerian.BTable.EDetailsView : undefined));
                    },
                    set: function (v) {
                        var lastViewMode = this.viewMode;
                        switch (v) {
                            case Tigerian.BTable.EListView:
                                this.setAttribute("view-mode", "list");
                                break;

                            case Tigerian.BTable.EDetailsView:
                                this.setAttribute("view-mode", "details");
                                break;

                            default:
                        }

                        if (lastViewMode !== this.viewMode) {
                            refreshView();
                            this.dispatchEvent(Tigerian.Event.onViewChanged);
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

                this.addRow = function () {
                    addRow();
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
                    rowCount = 0;
                    ctrlTableBody.clear();
                    ctrlTableBody.addControl(ctrlHeadRow);
                    // refreshView();
                };

                /**
                 * @param {number} index 
                 */
                // this.removeItem = function (index) {
                //     superRemoveItem(index);
                //     refreshView();
                // };

                // this.removeRow = this.removeItem;

                this.addControl = this.addItem = this.addRow;
            }
        }
    },
    enums: ["unlimit", "listView", "detailsView"],
});