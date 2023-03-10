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
export class BCascade extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    /**
     * 
     * @param {Object} that 
     * @param {Control} ctrlSubMenu 
     */
    this.config = (that, ctrlSubMenu) => {
      if (instanceOf(that, Control) && instanceOf(ctrlSubMenu, Control)) {
        // let ctrlSubMenu;

        that.datasete.hasChild = "false";
        that.dataset.openChild = "false";
        ctrlSubMenu.visible = false;

        /**
         * @member {boolean} hasChild
         */
        Object.defineProperty(that, "hasChild", {
          enumerable: true,
          configurable: true,
          get() {
            return (that.dataset.hasChild === "true");
          }
        });

        /**
         * 
         * @param {Boolean} visible 
         */
        that.viewChild = (visible) => {
          if (that.hasChild) {
            ctrlSubMenu.visible = visible;

            that.dataset.openChild = ctrlSubMenu.visible;
          }
        };

        that.toggle = () => {
          if (that.hasChild) {
            ctrlSubMenu.visible = !ctrlSubMenu.visible;

            that.dataset.openChild = ctrlSubMenu.visible;
          }
        };

        /**
         * 
         * @param {Control} child 
         */
        that.addControl = (child) => {
          // ctrlSubMenu = child;
          // child.visible = false;
          that.dataset.hasChild = "true";
          // that.addControl(child);
          ctrlSubMenu.addControl(child);
        };
      }
    };
  }
}