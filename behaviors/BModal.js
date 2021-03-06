import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";

("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
export class BModal extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.defineMethod("config", (that, ctrlParent, ctrlModal) => {
      let status = EModal.CLOSE;
      let elmCoverage = new Control(ctrlParent, that.theme);
      let superVisible = Object.getOwnPropertyDescriptor(that, "visible");

      elmCoverage.setAttribute("element-type", "Modal");
      elmCoverage.setAttribute("element-name", "coverage");
      elmCoverage.setAttribute("element-situation", "opposite");

      if (ctrlModal === undefined) {
        ctrlModal = that;
      }

      if (that === ctrlModal) {
        elmCoverage.addControl(that);
      }

      that.defineProperty("status", {
        get() {
          return status;
        },
        set(v) {
          if (instanceOf(v, Symbol)) {
            switch (v) {
              case EModal.SHOW:
                status = v;
                if (that !== ctrlModal) {
                  ctrlModal.show();
                } else {
                  superVisible.set.bind(that)(true);
                  elmCoverage.setAttribute("status", "show");
                  elmCoverage.setAttribute("visible", "true");
                  ctrlParent.setAttribute("hide-overflow", "false");
                }

                break;

              case EModal.MODAL:
                status = v;
                if (that !== ctrlModal) {
                  ctrlModal.modal();
                } else {
                  superVisible.set.bind(that)(true);
                  elmCoverage.setAttribute("status", "modal");
                  elmCoverage.setAttribute("visible", "true");
                  ctrlParent.setAttribute("hide-overflow", "true");
                }

                break;

              case EModal.CLOSE:
                status = v;
                if (that !== ctrlModal) {
                  ctrlModal.close();
                } else {
                  superVisible.set.bind(that)(false);
                  elmCoverage.setAttribute("status", "close");
                  elmCoverage.setAttribute("visible", "false");
                  ctrlParent.setAttribute("hide-overflow", "false");
                }

                break;
              default:
            }
          }
        },
      });

      that.defineProperty("visible", {
        get() {
          return (that.status !== EModal.CLOSE)
        },
        set(v) {
          that.status = (v ? EModal.SHOW : EModal.CLOSE);
        },
        type: Boolean
      });

      that.defineMethod("showModal", () => {
        ctrlModal.status = EModal.MODAL;
      });

      that.defineMethod("show", () => {
        ctrlModal.status = EModal.SHOW;
      });

      that.defineMethod("close", () => {
        ctrlModal.status = EModal.CLOSE;
      });

      if (that !== ctrlModal) {
        that.addControl = ctrlModal.addControl.bind(that);
      }
    }, [Object, Control]);
  }
}

export const EModal = Object.freeze({
  SHOW: Symbol("show"),
  CLOSE: Symbol("close"),
  MODAL: Symbol("modal")
});