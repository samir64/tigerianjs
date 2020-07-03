import {
  instanceOf
} from "../core/Tigerian.js";
import {
  BWindow
} from "../behaviors/BWindow.js";
import {
  ModelView
} from "../core/ModelView.js";
import {
  Events
} from "../core/Events.js";
import {
  BEvent
} from "../behaviors/BEvent.js";

/**
 * Created by samir on 8/27/18.
 */

("use strict");

/**
 * @extends {ModelView}
 * @implements {BWindow}
 * @implements {BEvent}
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
    this.config(BEvent);

    /**
     * @member {Function}
     */
    this.show = () => {
      container.visible = true;
    };

    /**
     * @member {Function}
     */
    this.hide = () => {
      container.visible = false;
    };

    /**
     * @member {Function}
     */
    this.refresh = (params, path, parts) => {
      params = instanceOf(params, Object) ? params : {};
      path = instanceOf(path, String) ? path : "";
      parts = instanceOf(parts, Array) ? parts : [];

      this.dispatchEvent(Events.onRefresh, {
        params,
        path,
        parts
      });
    };
  }
}