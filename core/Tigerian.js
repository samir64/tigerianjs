import "./String.js";
import "./Object.js";
import "../style/Responsive.js";

import { Behavior } from "./Behavior.js";

("use strict");

export class Tigerian {
  constructor(...behaviors) {
    if (this.constructor === Behavior) {
      throw new Error("Tigerian is an abstract class.");
    } else {
      Object.defineProperty(this, "behaviors", {
        enumerable: true,
        configurable: false,
        writable: true,
        value: []
      });

      var that = this;
      var configs = [];

      behaviors.forEach(behavior => {
        if (
          behavior.prototype instanceof Behavior &&
          behavior.constructor !== Behavior
        ) {
          var obj = new behavior();
          this.behaviors.push(behavior);
          configs.push(obj.config);
          obj.clone(that);
          // Object.assign(this, new behavior().clone());
        }
      });

      Object.defineProperty(this, "config", {
        enumerable: true,
        configurable: true,
        value(behavior, ...params) {
          if (Object.getPrototypeOf(behavior) === Behavior) {
            that.behaviors.forEach((item, index) => {
              if (item === behavior) {
                configs[index](that, ...params);
              }
            });
          }
        }
      });
    }
  }
}
