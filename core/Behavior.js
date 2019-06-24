("use strict");

/**
 */
export class Behavior {
  /**
   * @constructs
   * @param {string} behavior
   */
  constructor() {
    if (this.constructor === Behavior) {
      throw new Error("Behavior is an abstract class.");
    } else {
      if (Object.getPrototypeOf(this.constructor) !== Behavior) {
        throw new Error("This class extends from another behavior.");
      }
    }

    this.config = () => {};
  }
}
