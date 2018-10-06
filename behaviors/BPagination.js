"use strict";

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 */
Tigerian.BPagination = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("pagination");
    },
    /**
     * @param {string} behavior
     * @param {Tigerian.Control} ctrlNavigation
     */
    config: function (behavior, ctrlNavigation) {
        if (behavior === "pagination") {
            if (!Tigerian.Class.isInstance(ctrlNavigation, Tigerian.Control)) {
                ctrlNavigation = this;
            }

            if (Tigerian.Class.isInstance(ctrlNavigation, Tigerian.Control)) {
                var pageNo = 0;
                var pageCount = 0;
                var labelCount = 7;

                var instance = this;
                var theme = ctrlNavigation.theme;

                var container = new Tigerian.Control(ctrlNavigation, theme);
                var ctrlFirst = new Tigerian.Button(container, "««", theme);
                var ctrlPrev = new Tigerian.Button(container, "«", theme);
                // var ctrlPage = new Tigerian.Label(container, "0 / 0", theme);
                var ctrlPageList = new Tigerian.Control(container, theme);
                var ctrlNext = new Tigerian.Button(container, "»", theme);
                var ctrlLast = new Tigerian.Button(container, "»»", theme);

                container.setAttribute("element-type", "Pagination");
                container.setAttribute("element-name", "container");

                ctrlPageList.setAttribute("element-type", "Pagination");
                ctrlPageList.setAttribute("element-name", "labels");

                ctrlFirst.normalColumn = 1;
                ctrlPrev.normalColumn = 1;
                // ctrlPage.normalColumn = 8;
                ctrlPageList.normalColumn = 8;
                ctrlNext.normalColumn = 1;
                ctrlLast.normalColumn = 1;

                // ctrlPage.visible = false;

                // ctrlPage.align = Tigerian.Control.ECenter;

                var addLabel = function (index) {
                    var label = new Tigerian.Label(ctrlPageList, index.toString(), ctrlNavigation.theme);
                    label.normalColumn = 1;
                    if (Tigerian.Class.isInstance(index, "number")) {
                        label.setAttribute("active", (pageNo !== index) ? "true" : "false");

                        if (pageNo !== index) {
                            label.addEvent("click", function (e) {
                                instance.pageNumber = index;
                            });
                        }
                    }
                };

                var fillPageList = function () {
                    var first = Math.max(2, pageNo - Math.floor((labelCount - 2) / 2));
                    var last = Math.min(pageCount - 1, pageNo + Math.ceil((labelCount - 2) / 2) - 1);

                    if (last - first < labelCount) {
                        if (first > 2) {
                            first = Math.max(2, last - (labelCount - 2) + 1);
                        } else if (last < pageCount - 1) {
                            last = Math.min(pageCount - 1, first + (labelCount - 2) - 1);
                        }
                    }

                    addLabel(1);
                    if (first > 2) {
                        addLabel("…");
                    }
                    if (pageCount > 2) {
                        for (var i = first; i <= last; i++) {
                            addLabel(i);
                        }
                    }
                    if (last < pageCount - 1) {
                        addLabel("…");
                    }
                    if (pageCount > 1) {
                        addLabel(pageCount);
                    }
                };

                var refresh = function () {
                    ctrlNavigation.visible = (pageCount > 0);
                    // ctrlPage.text = "{} / {}".format(pageNo, instance.pageCount);
                    ctrlPageList.clear();
                    if (pageCount > 0) {
                        fillPageList();
                    }
                    instance.dispatchEvent(Tigerian.Event.onViewRefresh);
                };

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
                            var lastPageNo = pageNo;
                            pageNo = Math.max((pageCount === 0) ? 0 : 1, Math.min(v, pageCount));

                            if (lastPageNo !== pageNo) {
                                refresh();
                                this.dispatchEvent(Tigerian.Event.onPageChanged);
                            }
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
                        return pageCount;
                    },
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "number")) {
                            var lastPageCount = pageCount;
                            pageCount = Math.max(0, v);

                            if (lastPageCount !== pageCount) {
                                var lastPageNo = pageNo;
                                this.dispatchEvent(Tigerian.Event.onPageCountChanged);
                                this.pageNumber = pageNo;

                                if (lastPageNo === pageNo) {
                                    refresh();
                                }
                            }
                        }
                    },
                });

                /**
                 * @member {number}
                 */
                Object.defineProperty(this, "labelCount", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return labelCount;
                    },
                    set: function (v) {
                        if (Tigerian.Class.isInstance(v, "number")) {
                            var lastLabelCount = labelCount;
                            labelCount = Math.max(0, v);

                            if (lastLabelCount !== labelCount) {
                                refresh();
                            }
                        }
                    },
                });

                ctrlNext.addEvent("click", function (e) {
                    var lastPageNo = pageNo;
                    instance.pageNumber++;
                    if (lastPageNo !== pageNo) {
                        refresh();
                        instance.dispatchEvent(Tigerian.Event.onNextPage);
                        instance.dispatchEvent(Tigerian.Event.onPageChanged);
                    }
                });

                ctrlPrev.addEvent("click", function (e) {
                    var lastPageNo = pageNo;
                    instance.pageNumber--;
                    if (lastPageNo !== pageNo) {
                        refresh();
                        instance.dispatchEvent(Tigerian.Event.onPreviousPage);
                        instance.dispatchEvent(Tigerian.Event.onPageChanged);
                    }
                });

                refresh();
            }
        }
    },
    enums: [],
});