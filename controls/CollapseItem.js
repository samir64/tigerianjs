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
import {
  CollapseList
} from "./CollapseList.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 * @implements {BCascade}
 */
export class CollapseItem extends Control {
  /**
   * @constructs
   * @param {Control} parent
   * @param {string} text = ""
   * @param {string} theme = ""
   */
  constructor(parent, text = "", theme = "") {
    super(parent, theme, "li");

    let elmText = document.createElement("div");
    let ctrlList = new CollapseList(null, this.theme);

    this.addControl(elmText);
    this.addControl(ctrlList);

    this.config(BText, elmText, text);
    this.config(BCascade, ctrlList);

    let that = this;
    let superAddControl = this.addControl;
    let canChangeChildState = true;
    let touchStarted = false;

    ctrlList.visible = false;

    // this.setAttribute("element-type", "CollapseItem");
    this.setAttribute("element-name", "container");

    // elmText.setAttribute("element-type", "CollapseItem");
    // elmText.setAttribute("element-name", "text");

    /**
     * 
     * @param {String|CollapseItem} item 
     */
    this.addControl = (item) => {
      if (instanceOf(item, String)) {
        let item = new CollapseItem(undefined, item, theme);
      }

      superAddControl(item);
    };

    this.collapse = () => {
      that.viewChild(false);
      if (that.hasChild) {
        ctrlList.collapseAll();
      }
    };

    this.expand = () => {
      that.viewChild(true);
      for (let i = 0; i < this.itemCount; i++) {
        ctrlList.expandAll();
      }
    };

    elmText.addEventListener("click", (e) => {
      if (canChangeChildState && !touchStarted) {
        that.toggle();
        canChangeChildState = false;
      }

      setTimeout(() => {
        canChangeChildState = true;
      }, 100);
    });

    elmText.addEventListener("touchstart", (e) => {
      if (canChangeChildState) {
        touchStarted = true;
      }
    });

    elmText.addEventListener("touchend", (e) => {
      if (canChangeChildState && touchStarted && (document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY) === e.changedTouches[0].target)) {
        that.viewChild();
        canChangeChildState = false;
        touchStarted = true;
      }

      setTimeout(() => {
        canChangeChildState = true;
      }, 100);
    });
  }
}