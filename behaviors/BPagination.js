import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";

"use strict";

/**
 * @constructor
 * @extends {Behavior}
 */
export class BPagination extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     * @param {Control} ctrlNavigation 
     */
    this.config = (that, ctrlNavigation) => {
      let pageNo = 0;
      let pageCount = 0;
      let labelCount = 7;

      let theme = ctrlNavigation.theme;
      let navButtons = EPagination.ALL;

      let container = new Control(ctrlNavigation);
      let ctrlFirst = new Button(container, "❬ ❬");
      let ctrlPrev = new Button(container, "❰");
      let ctrlPageList = new Control(container);
      let ctrlNext = new Button(container, "❱");
      let ctrlLast = new Button(container, "❭ ❭");

      // container.setAttribute("element-type", "Pagination");
      container.dataset.elementName = "container";

      // ctrlPageList.setAttribute("element-type", "Pagination");
      ctrlPageList.dataset.elementName = "labels";

      ctrlFirst.normalColumn = 1;
      ctrlPrev.normalColumn = 1;
      ctrlPageList.normalColumn = 8;
      ctrlNext.normalColumn = 1;
      ctrlLast.normalColumn = 1;

      let addLabel = (index) => {
        let label = new Label(ctrlPageList, index.toString(), ctrlNavigation.theme);
        label.normalColumn = 1;
        if (instanceOf(index, "number")) {
          label.dataset.active = (pageNo !== index) ? "true" : "false";

          label.hoverable = true;

          if (pageNo !== index) {
            label.addEvent("click", (e) => {
              that.pageNumber = index;
            });
          } else {
            label.situation = Control.EDisable;
          }
        }
      };

      let fillPageList = () => {
        let first = Math.max(2, pageNo - Math.floor((labelCount - 2) / 2));
        let last = Math.min(pageCount - 1, pageNo + Math.ceil((labelCount - 2) / 2) - 1);

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
          for (let i = first; i <= last; i++) {
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

      let refresh = () => {
        ctrlFirst.visible = ctrlLast.visible = ((navButtons === BPagination.EAll) || (navButtons === BPagination.EFirstLast));
        ctrlPrev.visible = ctrlNext.visible = ((navButtons === BPagination.EAll) || (navButtons === BPagination.EPreviousNext));
        ctrlNavigation.visible = (pageCount > 0);
        // ctrlPage.text = `${pageNo} / ${that.pageCount}`;
        ctrlPageList.clear();
        if (pageCount > 0) {
          fillPageList();
        }
        that.dispatchEvent(Events.onViewRefresh);
      };

      /**
       * @member {number}
       */
      Object.defineProperty(that, "pageNumber", {
        enumerable: true,
        configurable: true,
        get() {
          return pageNo;
        },
        set(v) {
          let lastPageNo = pageNo;
          pageNo = Math.max((pageCount === 0) ? 0 : 1, Math.min(v, pageCount));

          if (lastPageNo !== pageNo) {
            refresh();
            this.dispatchEvent(Events.onPageChange);
          }
        }
      });

      /**
       * @member {number}
       */
      Object.defineProperty(that, "pageCount", {
        enumerable: true,
        configurable: true,
        get() {
          return pageCount;
        },
        set(v) {
          let lastPageCount = pageCount;
          pageCount = Math.max(0, v);

          if (lastPageCount !== pageCount) {
            let lastPageNo = pageNo;
            this.dispatchEvent(Events.onPageCountChange);
            pageNo = Math.max((pageCount === 0) ? 0 : 1, Math.min(pageNo, pageCount));
            refresh();
          }
        }
      });

      /**
       * @member {number}
       */
      Object.defineProperty(that, "labelCount", {
        enumerable: true,
        configurable: true,
        get() {
          return labelCount;
        },
        set(v) {
          let lastLabelCount = labelCount;
          labelCount = Math.max(0, v);

          if (lastLabelCount !== labelCount) {
            refresh();
          }
        }
      });

      /**
       * @member {number}
       */
      Object.defineProperty(that, "navigationButtons", {
        enumerable: true,
        configurable: true,
        get() {
          return navButtons;
        },
        set(v) {
          let lastNavBtns = navButtons;
          switch (v) {
            case EPagination.ALL:
            case EPagination.NONE:
            case EPagination.FIRST_LAST:
            case EPagination.PREVIOUS_NEXT:
              navButtons = v;
              break;
            default:
              navButtons = EPagination.NONE;
          }

          if (lastNavBtns !== navButtons) {
            refresh();
          }
        }
      });

      ctrlNext.addEvent("click", (e) => {
        let lastPageNo = pageNo;
        that.pageNumber++;
        if (lastPageNo !== pageNo) {
          refresh();
          that.dispatchEvent(Events.onNextPage);
        }
      });

      ctrlPrev.addEvent("click", (e) => {
        let lastPageNo = pageNo;
        that.pageNumber--;
        if (lastPageNo !== pageNo) {
          refresh();
          that.dispatchEvent(Events.onPreviousPage);
        }
      });

      ctrlFirst.addEvent("click", (e) => {
        let lastPageNo = pageNo;
        that.pageNumber = 0;
        if (lastPageNo !== pageNo) {
          refresh();
        }
      });

      ctrlLast.addEvent("click", (e) => {
        let lastPageNo = pageNo;
        that.pageNumber = pageCount;
        if (lastPageNo !== pageNo) {
          refresh();
        }
      });

      refresh();
    };
  }
}

export const EPagination = Object.freeze({
  FIRST_LAST: Symbol("first_last"),
  PREVIOUS_NEXT: Symbol("previous_next"),
  ALL: Symbol("all"),
  NONE: Symbol("none")
});