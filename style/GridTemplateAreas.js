/**
 * Created by samir on 8/31/18.
 */

("use strict");

/**
 * @extends {Class}
 * @constructor
 */
GridTemplateAreas = Class.extend({
    /**
     * @constructs
     * @param {Element} element
     * @param {string} name
     * @param {number} colCount
     * @param {number} rowCount
     */
    init: function (element, name, rowCount, colCount) {
        if (Class.isInstance(element, Text) && Class.isInstance(name, "string")) {
            this.super();

            if (Class.isInstance(colCount, "number")) {
                colCount = Math.max(1, Math.abs(colCount));
            } else {
                colCount = 1;
            }

            if (Class.isInstance(rowCount, "number")) {
                rowCount = Math.max(1, Math.abs(rowCount));
            } else {
                rowCount = 1;
            }

            var queryText = element.data;
            /**
             * @type {GridTemplateItem[][]}
             */
            var items = [];
            var itemsName = [];

            for (var r = 0; r < rowCount; r++) {
                var row = [];
                for (var c = 0; c < colCount; c++) {
                    row.push([]);
                }

                items.push(row);
            }

            var render = function () {
                var areas = '  [element-name="container"][template-name="{tname}"][visible="true"] {\n    display: grid;\n    grid-template-areas:\n'.format({
                    tname: name
                });

                for (var rowIdx in items) {
                    var thisRow = "";
                    for (var colIdx = 0; colIdx < items[rowIdx].length; colIdx++) {
                        if (thisRow === "") {
                            thisRow += "    '";
                        } else {
                            thisRow += " ";
                        }

                        for (var i = 0; i < items[rowIdx][colIdx].colSpan; i++) {
                            if (i > 0) {
                                thisRow += " ";
                            }

                            thisRow += items[rowIdx][colIdx].name;
                        }

                        if (items[rowIdx][colIdx].name) {
                            colIdx += i - 1;
                        }
                    }
                    thisRow += "'\n";
                    areas += thisRow;
                }
                areas += "  }";

                for (var i = 0; i < itemsName.length; i++) {
                    areas += "\n\n  [element-name=\"container\"][template-name=\"{tname}\"] > [element-name=\"container\"][template-item=\"{iname}\"] {\n    grid-area: {iname};\n  }".format({
                        tname: name,
                        iname: itemsName[i]
                    });
                }

                // return areas;
                return queryText.format({
                    template: areas
                });
            }

            /**
             * @param {string} itemName
             * @param {number} rowNo
             * @param {number} colNo
             * @param {number} rowSpan
             * @param {number} colSpan
             */
            this.addItem = function (itemName, rowNo, colNo, rowSpan, colSpan) {
                if (itemsName.indexOf(itemName) === -1) {
                    if (Class.isInstance(itemName, "string") && Class.isInstance(colNo, "number") && Class.isInstance(rowNo, "number")) {
                        if ((colNo >= 0) && (colNo < colCount) && (rowNo >= 0) && (rowNo < rowCount)) {
                            for (var i = 0; i < rowSpan; i++) {
                                items[rowNo + i][colNo] = new GridTemplateItem(itemName, colSpan);
                            }
                        }
                    }

                    itemsName.push(itemName);
                }

                element.data = render();
            };

            /**
             * @member {string}
             */
            Object.defineProperty(this, "name", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return name;
                },
                set: function (v) {
                    if (Class.isInstance(v, "string")) {
                        name = v;
                    }
                },
            });

            /**
             * @member {number}
             * @readonly
             */
            Object.defineProperty(this, "colCount", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return colCount;
                },
            });

            /**
             * @member {number}
             * @readonly
             */
            Object.defineProperty(this, "rowCount", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return rowCount;
                },
            });
        }
    }
});