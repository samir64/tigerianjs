import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BSelect
} from "../behaviors/BSelect.js";
import {
  BGroup
} from "../behaviors/BGroup.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  BFilter
} from "../behaviors/BFilter.js";

/**
 * Created by samir on 11/11/16.
 */

("use strict");

/**
 * @extends {Control}
 * @implements {BGroup}
 * @implements {BFilter}
 * @implements {BText}
 * @constructor
 */
export class ComboBox extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} [theme = ""]
   */
  constructor(parent, theme = "") {
    super(parent, theme);

    let ctrlLabel = new Label(this, "", theme);
    let ctrlText = new TextBox(this, "", theme);
    let ctrlList = new ListBox(this, theme);

    this.config(BGroup, ctrlList);
    this.config(BFilter, ctrlText, ctrlList);
    this.config(BText, ctrlText);

    //Note Private Variables
    let that = this;
    let editable = false;
    let instance = this;
    let superAddControl = this.addControl.bind(this);
    let selectRequire = false;
    let canChangeVisible = true;

    ctrlText.hoverable = ctrlLabel.hoverable = true;

    //NOTE Attributes
    // this.setAttribute("element-type", "ComboBox");
    this.setAttribute("element-name", "container");
    // ctrlLabel.setAttribute("element-name", "label");
    // ctrlText.setAttribute("element-name", "Text");
    // ctrlList.setAttribute("element-name", "list");

    //NOTE Private Functions
    let showList = (e) => {
      if (canChangeVisible) {
        instance.filter("");
        ctrlList.visible = true;

        canChangeVisible = false;
      }

      setTimeout(() => {
        canChangeVisible = true;
      }, 20);
    };

    let hideList = (e) => {
      if (canChangeVisible) {
        ctrlList.visible = false;
        if (selectRequire) {
          if (ctrlList.selectedIndex >= 0) {
            ctrlLabel.text = ctrlList.getItem(ctrlList.selectedIndex).text;
            instance.text = ctrlList.getItem(ctrlList.selectedIndex).text;
          } else {
            ctrlLabel.text = "";
            ctrlText.text = "";
          }
        } else {
          if (
            ctrlList.selectedIndex >= 0 &&
            ctrlList.getItem(ctrlList.selectedIndex).text !== ctrlText.text
          ) {
            ctrlList.selectedIndex = -1;
          }
        }

        canChangeVisible = false;
      }

      setTimeout(() => {
        canChangeVisible = true;
      }, 20);
    };

    let show_hideList = (e) => {
      if (ctrlList.visible) {
        hideList(e);
      } else {
        showList(e);
      }
    };

    let onSelectedIndexChange = (e) => {
      if (ctrlList.selectedIndex >= 0) {
        ctrlLabel.text = ctrlList.getItem(ctrlList.selectedIndex).text;
        instance.text = ctrlList.getItem(ctrlList.selectedIndex).text;
      } else {
        ctrlLabel.text = instance.text = "";
      }
      ctrlList.visible = false;
    };

    //NOTE Properties
    /**
     * @member {boolean}
     */
    this.defineProperty("editable", {
      get() {
        return editable;
      },
      set(v) {
        editable = v;

        ctrlText.visible = v;
        ctrlLabel.visible = !v;
        ctrlList.visible = false;

        that.filtering = v;
      },
      type: Boolean
    });

    /**
     * @member {number}
     */
    this.defineProperty("selectedIndex", {
      get() {
        return ctrlList.selectedIndex;
      },
      set(v) {
        ctrlList.selectedIndex = v;
      },
      type: Number
    });

    /**
     * @member {boolean}
     */
    this.defineProperty("selectRequire", {
      get() {
        return selectRequire;
      },
      set(v) {
        selectRequire = v;
      },
      type: Boolean
    });

    //NOTE Public Functions
    /**
     * @param {ListItem|string} item
     */
    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, String)) {
        item = new ListItem(null, item, that.theme);
      } else if (!instanceOf(item, BSelect)) {
        item = new ListItem(
          null,
          "Item " + (that.itemCount + 1).toString(),
          that.theme
        );
      }

      item.autoDeselect = that.multiSelect;
      superAddControl(item);
    }, [
      [String, ListItem]
    ]);

    //NOTE Constructor Statement
    ctrlText.visible = false;
    ctrlList.visible = false;

    //NOTE Events
    window.addEventListener(
      "click",
      (e) => {
        if (!(instance.editable && ctrlText.focused) && ctrlList.visible) {
          hideList();
          // } else if (!ctrlList.visible) {
          //     showList(e);
        }
      },
      true
    );
    ctrlLabel.addEvent("click", show_hideList);
    ctrlText.addEvent("focus", showList);
    ctrlText.addEvent("blur", (e) => {
      setTimeout(hideList, 150);
    });
    ctrlText.addEvent("click", (e) => {
      if (ctrlText.focused && !ctrlList.visible) {
        showList(e);
      }
    });
    ctrlText.addEvent("keydown", (e) => {
      if (e.code === "Enter" || e.code === "Escape") {
        hideList(e);
      } else if (!ctrlList.visible) {
        showList(e);
      }
    });
    ctrlList.addEvent("selectedindexchange", onSelectedIndexChange);
  }
}