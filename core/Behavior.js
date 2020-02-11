import {
  forEach,
  defineMethod as dm,
  defineProperty as dp,
  abstract
} from "./Tigerian.js";

("use strict");

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

  /**
   * @param {Function} descriptor
   * @param {Object} dataTypes
   */
  defineMethod(name, descriptor, dataTypes = {}) {
    return dm(this, name, descriptor, dataTypes);
  }

  /**
   * @param {string} name 
   * @param {Function} get 
   * @param {Function} set 
   * @param {boolean} configurable 
   * @param {boolean} enumurable 
   */
  defineProperty(name, {
    value = undefined,
    get = undefined,
    set = undefined,
    type = undefined,
    configurable = true,
    enumerable = true
  }) {
    dp(this, name, {
      value,
      get,
      set,
      type,
      configurable,
      enumerable
    });
  }
}