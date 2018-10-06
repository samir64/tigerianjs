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
        if ((behavior === "pagination") && (Tigerian.Class.isInstance(ctrlNavigation, Tigerian.Control))) {
            var pageNo = 0;
            var pageCount = 0;

            var instance = this;

            var ctrlPrev = new Tigerian.Button(ctrlNavigation, "«", this.theme);
            var ctrlPage = new Tigerian.Label(ctrlNavigation, "0 / 0", this.theme);
            var ctrlNext = new Tigerian.Button(ctrlNavigation, "»", this.theme);

            ctrlPrev.normalColumn = 4;
            ctrlPage.normalColumn = 4;
            ctrlNext.normalColumn = 4;

            ctrlPage.align = Tigerian.Control.ECenter;

            var refresh = function () {
                ctrlPage.text = "{} / {}".format(pageNo, instance.pageCount);
                // ctrlRowCount.text = "Rows: {}".format(rowCount);
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
        }
    },
    enums: [],
});