import {
  forEach,
  abstract
} from "./Tigerian.js";

"use strict";

/**
 */
export class Behavior {
  /**
   * @constructs
   * @param {string} behavior
   */
  constructor() {
    abstract(this, Behavior);

    if (Object.getPrototypeOf(this.constructor) !== Behavior) {
      throw new Error("This class extends from another behavior. You have to extend your behaviors from main Behavior class.");
    }

    this.config = () => {};
  }

  static[Symbol.hasInstance](instance) {
    let result = false;

    forEach(instance.behaviors, (behavior) => {
      if (behavior === this) {
        result = true;
      }
    });

    return result;
  }
}