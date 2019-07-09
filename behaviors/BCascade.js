import {
  instanceOf
} from "../core/Tigerian.js";

("use strict");

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

    this.defineMethod("config", (that) => {
      if (instanceOf(that, Control)) {
        var ctrlSubMenu;

        var superClass = that.super;

        that.setAttribute("has-child", "false");
        that.setAttribute("open-child", "false");
      }

      /**
       * @member {boolean} hasChild
       */
      that.defineProperty("hasChild", {
        get() {
          return (that.getAttribute("has-child") === "true");
        }
      });

      that.defineMethod("viewChild", (visible) => {
        if (that.hasChild) {
          ctrlSubMenu.visible = visible;

          that.setAttribute(
            "open-child",
            ctrlSubMenu.visible ? "true" : "false"
          );
        }
      }, [Boolean]);

      that.defineMethod("toggle", () => {
        if (that.hasChild) {
          ctrlSubMenu.visible = !ctrlSubMenu.visible;

          that.setAttribute(
            "open-child",
            ctrlSubMenu.visible ? "true" : "false"
          );
        }
      });

      that.defineMethod("addControl", (child) => {
        ctrlSubMenu = child;
        child.visible = false;
        that.setAttribute("has-child", "true");
        that.addControl(child);
      }, [Control]);
    });
  }
}