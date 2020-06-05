import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  BCascade
} from "../behaviors/BCascade.js";
import { Menu } from "./Menu.js";
import { Spacer } from "./Spacer.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 * @implements {BCascade}
 */
export class MenuItem extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text
   * @param {string} theme = ""
   */
  constructor(parent, text, theme = "") {
    super(parent, theme, "li");

    let elmText = document.createElement("div");
    let ctrlMenu = new Menu(null, theme);
    let superAddControl = this.addControl.bind(this);

    this.config(BText, elmText, text);
    this.config(BCascade, ctrlMenu);

    let cascadeAddControl = this.addControl.bind(this);

    let canChangeChildState = true;
    let touchStarted = false;
    let openByClick = false;

    let that = this;

    superAddControl(elmText);
    superAddControl(ctrlMenu);
    this.hoverable = true;

    this.setAttribute("element-type", "MenuItem");
    this.setAttribute("element-name", "container");

    elmText.setAttribute("element-type", "MenuItem");
    // elmText.setAttribute("element-name", "text");

    /**
     * @param {MenuItem|Spacer} item
     */
    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, MenuItem) || instanceOf(item, Spacer)) {
        if (!that.hasSubmenu) {
        }
        // ctrlMenu.addControl(item);
        cascadeAddControl(item);
      }
    }, [MenuItem, Spacer]);

    this.addEvent("mouseover", (e) => {
      if (canChangeChildState && !touchStarted) {
        that.viewChild(true);
      }
    });
    this.addEvent("mouseleave", (e) => {
      if (canChangeChildState && !touchStarted) {
        that.viewChild(false);
      }
    });

    elmText.addEventListener("touchstart", (e) => {
      if (canChangeChildState) {
        touchStarted = true;
      }
    });

    elmText.addEventListener("touchend", (e) => {
      if (
        canChangeChildState &&
        touchStarted &&
        document.elementFromPoint(
          e.changedTouches[0].pageX,
          e.changedTouches[0].pageY
        ) === e.changedTouches[0].target
      ) {
        that.viewChild();
        canChangeChildState = false;
        touchStarted = false;
      }

      setTimeout(() => {
        canChangeChildState = true;
      }, 100);
    });
  }
}