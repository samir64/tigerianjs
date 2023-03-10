import {
  Behavior
} from "../core/Behavior.js";

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
     * @param {Array} list
     * @param {Number} index = 0
     */
    this.config = function (that, list = [], index = 0) {
      let generator = (i) => {
        return list[i];
      };
      let iterator = function* () {
        let result = generator(index++);
        do {
          yield result;
          result = generator(index++);
        } while (result !== undefined);
      };
      let it = iterator();

      Object.defineProperty(that, "iterator", {
        enumerable: true,
        configurable: true,
        get() {
          return it;
        },
        set(v) {
          generator = v;
        }
      });

      Object.defineProperty(iterator.prototype, "index", {
        enumerable: true,
        configurable: true,
        get() {
          return index;
        },
        set(v) {
          index = v;
          it = iterator();
        }
      });

      that[Symbol.iterator] = () => {
        return it;
      };

      iterator.prototype.first = () => {
        index = 0;
        it = iterator();
      };
    };
  }
}