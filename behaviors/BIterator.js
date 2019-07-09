import {
  Behavior
} from "../core/Behavior.js";

("use strict");

/**
 * @constructor
 * @extends {Behavior}
 * @interface
 */
export class BIterator extends Behavior {
  constructor() {
    super();

    /**
     * @constructs
     * @param {{list: Array, currentIndex: number, value: *, done: boolean}} params
     */
    this.config = function (that, list = [], index = 0) {
      var generator = function (i) {
        return list[i];
      };
      var iterator = function* () {
        let result = generator(index++);
        do {
          yield result;
          result = generator(index++);
        } while (result !== undefined);
      };

      that.defineProperty("iterator", {
        enumerable: true,
        configurable: true,
        get() {
          return iterator();
        },
        set(v) {
          generator = v;
        },
        type: Function
      });

      Object.defineProperty(iterator.prototype, "index", {
        enumerable: true,
        configurable: true,
        get() {
          return index;
        },
        set(v) {
          index = v;
        }
      });

      that[Symbol.iterator] = () => {
        return iterator();
      };

      iterator.prototype.first = function () {
        index = 0;
      };
    };
  }
}