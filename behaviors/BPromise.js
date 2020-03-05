import { Behavior } from "../core/Behavior.js";
import { defineMethod, instanceOf } from "../core/Tigerian.js";

("use strict");

/**
 * @constructor
 * @extends {Behavior}
 * @interface
 */
export class BPromise extends Behavior {
  constructor() {
    super();

    /**
     * @constructs
     * @param {Function|Function[]} functions
     * @param {...String} otherStates
     */
    this.config = (that, functions, ...otherStates) => {
      if (instanceOf(functions, Function)) {
        functions = [functions];
      }

      otherStates = ["then", "reject", ...otherStates];

      for (const func of functions) {
        that.defineMethod(func.name, (...params) => {
          let result = {};
          let states = {};
          let methods = [];
          let done = false;

          (async () => {
            for (var number = 0; number < otherStates.length; number++) {
              let state = otherStates[number];

              if (state) {
                if (state === "reject") {
                  states[state] = {
                    number,
                    method() {},
                    callback(value) {
                      throw value;
                    }
                  };
                } else {
                  states[state] = {
                    number,
                    method() {},
                    callback() {}
                  };
                }

                defineMethod(
                  result,
                  state,
                  (st => callback => {
                    if (instanceOf(callback, Function)) {
                      states[st].callback = callback;
                    }
                    return result;
                  })(state)
                );

                states[state].method = (st => (...value) => {
                  if (!done) {
                    switch (st) {
                      case "then":
                      case "reject":
                        done = true;
                        break;
                      default:
                    }

                    states[st].callback(...value);
                  }
                })(state);

                methods.push(states[state].method);
              }
            }

            await func(...methods, ...params);
          })();

          return result;
        });
      }
    };
  }
}
