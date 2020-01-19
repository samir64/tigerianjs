import {
  instanceOf
} from "../core/Tigerian.js";
import {
  BWindow
} from "../behaviors/BWindow.js";
import {
  ModelView
} from "../core/ModelView.js";

/**
 * Created by samir on 8/27/18.
 */

("use strict");


/**
 * @extends {ModelView}
 * @implements {BWindow}
 * @constructor
 */
export class View extends ModelView {
  /**
   * @constructs
   * @param {Control} container
   */
  constructor(container) {
    super();

    this.config(BWindow);

    let show = function () {
      container.visible = true;
    };

    let hide = function () {
      container.visible = false;
    };

    let refresh = function (params) {};

    /**
     * @member {Function}
     */
    this.defineProperty("show", {
      get() {
        return show;
      },
      set(v) {
        show = v;
      },
      type: Function
    });

    /**
     * @member {Function}
     */
    this.defineProperty("hide", {
      get() {
        return hide;
      },
      set(v) {
        hide = v;
      },
      type: Function
    });

    /**
     * @member {Function}
     */
    this.defineProperty("refresh", {
      get() {
        return refresh;
      },
      set(v) {
        refresh = v;
      },
      type: Function
    });
  }
}