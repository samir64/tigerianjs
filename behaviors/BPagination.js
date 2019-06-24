("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
BPagination = Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("pagination");
    },
    /**
     * @param {string} behavior
     * @param {Control} ctrlNavigation
     */
    config: function (behavior, ctrlNavigation) {
        if (behavior === "pagination") {
            if (!Class.isInstance(ctrlNavigation, Control)) {
                ctrlNavigation = this;
            }

            if (Class.isInstance(ctrlNavigation, Control)) {
                var pageNo = 0;
                var pageCount = 0;
                var labelCount = 7;

                var instance = this;
                var theme = ctrlNavigation.theme;
                var navButtons = BPagination.EAll;

                var container = new Control(ctrlNavigation, theme);
                var ctrlFirst = new Button(container, "❬ ❬", theme);
                var ctrlPrev = new Button(container, "❰", theme);
                // var ctrlPage = new Label(container, "0 / 0", theme);
                var ctrlPageList = new Control(container, theme);
                var ctrlNext = new Button(container, "❱", theme);
                var ctrlLast = new Button(container, "❭ ❭", theme);

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

                // ctrlPageList.align = Control.ECenter;

                var addLabel = function (index) {
                    var label = new Label(ctrlPageList, index.toString(), ctrlNavigation.theme);
                    label.normalColumn = 1;
                    if (Class.isInstance(index, "number")) {
                        label.setAttribute("active", (pageNo !== index) ? "true" : "false");

                        label.hoverable = true;

                        if (pageNo !== index) {
                            label.addEvent("click", function (e) {
                                instance.pageNumber = index;
                            });
                        } else {
                            label.situation = Control.EDisable;
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
                    ctrlFirst.visible = ctrlLast.visible = ((navButtons === BPagination.EAll) || (navButtons === BPagination.EFirstLast));
                    ctrlPrev.visible = ctrlNext.visible = ((navButtons === BPagination.EAll) || (navButtons === BPagination.EPreviousNext));
                    ctrlNavigation.visible = (pageCount > 0);
                    // ctrlPage.text = "{} / {}".format(pageNo, instance.pageCount);
                    ctrlPageList.clear();
                    if (pageCount > 0) {
                        fillPageList();
                    }
                    instance.dispatchEvent(Events.onViewRefresh);
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
                        if (Class.isInstance(v, "number")) {
                            var lastPageNo = pageNo;
                            pageNo = Math.max((pageCount === 0) ? 0 : 1, Math.min(v, pageCount));

                            if (lastPageNo !== pageNo) {
                                refresh();
                                this.dispatchEvent(Events.onPageChange);
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
                        if (Class.isInstance(v, "number")) {
                            var lastPageCount = pageCount;
                            pageCount = Math.max(0, v);

                            if (lastPageCount !== pageCount) {
                                var lastPageNo = pageNo;
                                this.dispatchEvent(Events.onPageCountChange);
                                pageNo = Math.max((pageCount === 0) ? 0 : 1, Math.min(pageNo, pageCount));
                                refresh();
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
                        if (Class.isInstance(v, "number")) {
                            var lastLabelCount = labelCount;
                            labelCount = Math.max(0, v);

                            if (lastLabelCount !== labelCount) {
                                refresh();
                            }
                        }
                    },
                });

                /**
                 * @member {number}
                 */
                Object.defineProperty(this, "navigationButtons", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return navButtons;
                    },
                    set: function (v) {
                        var lastNavBtns = navButtons;
                        switch (v) {
                            case BPagination.EAll:
                            case BPagination.ENone:
                            case BPagination.EFirstLast:
                            case BPagination.EPreviousNext:
                                navButtons = v;
                                break;
                            default:
                                navButtons = BPagination.ENone;
                        }

                        if (lastNavBtns !== navButtons) {
                            refresh();
                        }
                    },
                });

                ctrlNext.addEvent("click", function (e) {
                    var lastPageNo = pageNo;
                    instance.pageNumber++;
                    if (lastPageNo !== pageNo) {
                        refresh();
                        instance.dispatchEvent(Events.onNextPage);
                    }
                });

                ctrlPrev.addEvent("click", function (e) {
                    var lastPageNo = pageNo;
                    instance.pageNumber--;
                    if (lastPageNo !== pageNo) {
                        refresh();
                        instance.dispatchEvent(Events.onPreviousPage);
                    }
                });

                ctrlFirst.addEvent("click", function (e) {
                    var lastPageNo = pageNo;
                    instance.pageNumber = 0;
                    if (lastPageNo !== pageNo) {
                        refresh();
                    }
                });

                ctrlLast.addEvent("click", function (e) {
                    var lastPageNo = pageNo;
                    instance.pageNumber = pageCount;
                    if (lastPageNo !== pageNo) {
                        refresh();
                    }
                });

                refresh();
            }
        }
    },
    enums: ["firstLast", "previousNext", "all", "none"],
});