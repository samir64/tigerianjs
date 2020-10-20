import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  Control
} from "../core/Control.js";

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

    /**
     * 
     * @param {Object} that 
     * @param {Control} ctrlParent 
     * @param {Control} ctrlModal 
     */
    this.config = (that, ctrlParent, ctrlModal) => {
      let status = EModal.CLOSE;
      let elmCoverage = new Control(ctrlParent, that.theme);
      let superVisible = Object.getOwnPropertyDescriptor(that, "visible");

      // elmCoverage.setAttribute("element-type", "Modal");
      elmCoverage.dataset.elementName = "coverage";
      elmCoverage.dataset.situation = "opposite";

      if (ctrlModal === undefined) {
        ctrlModal = that;
      }

      if (that === ctrlModal) {
        elmCoverage.addControl(that);
      }

      Object.defineProperty(that, "status", {
        enumerable: true,
        configurable: true,
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
                  elmCoverage.dataset.status = "show";
                  elmCoverage.dataset.visible = "true";
                  ctrlParent.dataset.hideOverflow = "false";
                }

                break;

              case EModal.MODAL:
                status = v;
                if (that !== ctrlModal) {
                  ctrlModal.modal();
                } else {
                  superVisible.set.bind(that)(true);
                  elmCoverage.dataset.status = "modal";
                  elmCoverage.dataset.visible = "true";
                  ctrlParent.dataset.hideOverflow = "true";
                }

                break;

              case EModal.CLOSE:
                status = v;
                if (that !== ctrlModal) {
                  ctrlModal.close();
                } else {
                  superVisible.set.bind(that)(false);
                  elmCoverage.dataset.status = "close";
                  elmCoverage.dataset.visible = "false";
                  ctrlParent.dataset.hideOverflow = "false";
                }

                break;
              default:
            }
          }
        },
      });

      Object.defineProperty(that, "visible", {
        enumerable: true,
        configurable: true,
        get() {
          return (that.status !== EModal.CLOSE)
        },
        set(v) {
          that.status = (v ? EModal.SHOW : EModal.CLOSE);
        }
      });

      that.showModal = () => {
        ctrlModal.status = EModal.MODAL;
      };

      that.show = () => {
        ctrlModal.status = EModal.SHOW;
      };

      that.close = () => {
        ctrlModal.status = EModal.CLOSE;
      };

      if (that !== ctrlModal) {
        that.addControl = ctrlModal.addControl.bind(that);
      }
    };
  }
}

export const EModal = Object.freeze({
  SHOW: Symbol("show"),
  CLOSE: Symbol("close"),
  MODAL: Symbol("modal")
});