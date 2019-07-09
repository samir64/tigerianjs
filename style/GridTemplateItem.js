import {
  instanceOf,
  Tigerian
} from "../core/Tigerian.js";

/**
 * Created by samir on 8/31/18.
 */

("use strict");

/**
 * @extends {Class}
 * @constructor
 */
export class GridTemplateItem extends Tigerian {
  /**
   * @constructs
   * @param {string} name
   * @param {number} colSpan
   */
  constructor(name, colSpan = 1) {
    if (instanceOf(name, String)) {
      super();

      colSpan = Math.max(1, Math.abs(colSpan));

      /**
       * @member {string}
       */
      this.defineProperty("name", {
        get() {
          return name;
        },
        set(v) {
          name = v;
        },
        type: String
      });

      /**
       * @member {number}
       */
      this.defineProperty("colSpan", {
        get() {
          return colSpan;
        },
        set(v) {
          colSpan = v;
        },
        type: Number
      });
    }
  }
}