import { Tigerian } from "./Tigerian.js";
import { BIterator } from "../behaviors/BIterator.js";

("use strict");

/**
 * @constructor
 * @extends {Tigerian}
 * @implements {BIterator}
 */
export class Iterator extends Tigerian {
  /**
   * @constructs
   * @param {Array} list
   * @param {number} currentIndex = 0
   */
  constructor(list, currentIndex = 0) {
    super();

    this.config(BIterator, list, currentIndex);
  }
}
