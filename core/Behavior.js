import {
  // forEach,
  abstract
} from "./Tigerian.js";

/**
 * @interface
 */
export default class Behavior {
  config() {}

  /**
   * @constructs
   * @param {string} behavior
   */
  constructor() {
    abstract(this, Behavior);

    if (Object.getPrototypeOf(this.constructor) !== Behavior) {
      throw new Error("This class extends from another behavior. You have to extend your behaviors from main Behavior class.");
    }
  }

  static[Symbol.hasInstance](instance) {
    return !!instance?.used?.(this);
  }
}