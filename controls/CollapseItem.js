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
    super(parent, theme);

    var elmText = document.createElement("div");
    var ctrlList = new CollapseList(null, this.theme);

    this.addControl(elmText);
    this.addControl(ctrlList);

    this.config(BText, elmText);
    this.config(BCascade, ctrlList);

    var that = this;
    var superAddControl = this.addControl;
    var canChangeChildState = true;
    var touchStarted = false;

    this.text = text;
    ctrlList.visible = false;

    this.setAttribute("element-type", "CollapseItem");
    this.setAttribute("element-name", "container");

    elmText.setAttribute("element-type", "CollapseItem");
    // elmText.setAttribute("element-name", "text");

    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, String)) {
        var item = new CollapseItem(undefined, item, theme);
      }

      superAddControl(item);
    }, [
      [String, CollapseItem /* , Spacer */ ]
    ]);
    /* this.defineMethod("addControl", (item) => {
      if (instanceOf(item, CollapseItem) || instanceOf(item, Spacer)) {
        if (!this.hasSubmenu) {
          superAddChild(ctrlList);
        }
        ctrlList.addControl(item);
      }
    }); */

    this.defineMethod("collapse", () => {
      that.viewChild(false);
      if (that.hasChild) {
        ctrlList.collapseAll();
      }
    });

    this.defineMethod("expand", () => {
      that.viewChild(true);
      for (var i = 0; i < this.itemCount; i++) {
        ctrlList.expandAll();
      }
    });

    elmText.addEventListener("click", function (e) {
      if (canChangeChildState && !touchStarted) {
        that.toggle();
        canChangeChildState = false;
      }

      setTimeout(function () {
        canChangeChildState = true;
      }, 100);
    });

    elmText.addEventListener("touchstart", function (e) {
      if (canChangeChildState) {
        touchStarted = true;
      }
    });

    elmText.addEventListener("touchend", function (e) {
      if (canChangeChildState && touchStarted && (document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY) === e.changedTouches[0].target)) {
        that.viewChild();
        canChangeChildState = false;
        touchStarted = true;
      }

      setTimeout(function () {
        canChangeChildState = true;
      }, 100);
    });
  }
}