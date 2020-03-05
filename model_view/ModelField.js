import {
  instanceOf,
  isA
} from "../core/Tigerian.js";
import {
  ModelView
} from "../core/ModelView.js";

/**
 * Created by samir on 8/27/18.
 */
("use strict");

/**
 * @extends {ModelView}
 * @constructor
 */
export class ModelField extends ModelView {
  /**
   * @constructs
   * @param {String} name
   * @param {String|Function} type = String
   * @param {boolean} collection = false
   * @param {*} value = undefined
   */
  constructor(name, type = String, collection = false, value = undefined) {
    if (instanceOf(name, String) && (name !== "")) {
      super();

      if (!(instanceOf(type, String) || instanceOf(type, Function) || isA(type, ModelView))) {
        type = String;
      }

      if (!instanceOf(value, type)) {
        value = undefined;
      }

      collection = ((collection === true) ? true : false);

      let setValue = (v) => {
        let val;
        if (instanceOf(v, type) || (v === undefined) || (instanceOf(v, Object) && isA(type, ModelView))) {
          if (instanceOf(v, "object")) {
            val = new type();

            for (let field in v) {
              if (field in val) {
                val[field] = v[field];
              }
            }
          } else {
            val = v;
          }

          if (collection) {
            if (instanceOf(value, Array)) {
              value.push(val);
            } else {
              value = [val];
            }
          } else {
            value = val;
          }
        }
      };

      /**
       * @member {string}
       */
      this.defineProperty("name", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: name,
      });

      /**
       * @member {string}
       */
      this.defineProperty("type", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: type,
      });

      /**
       * @member {boolean}
       */
      this.defineProperty("collection", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: collection,
      });

      /**
       * @member {*}
       */
      this.defineProperty("value", {
        enumerable: false,
        configurable: false,
        get() {
          return value;
        },
        set(v) {
          if (collection && instanceOf(v, Array)) {
            for (let i = 0; i < v.length; i++) {
              setValue(v[i]);
            }
          } else if (!collection && !instanceOf(v, Array)) {
            setValue(v);
          } else {
            // NOTE: Nothing
          }
        },
      });
    }
  }
}