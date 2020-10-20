import {
  Behavior
} from "../core/Behavior.js";
import {
  instanceOf,
  forEach,
  Tigerian
} from "../core/Tigerian.js";

export class BBind extends Behavior {
  constructor() {
    super();

    this.config = (that) => {
      let binds = {};
      let watchs = {};

      /**
       * @param {String} srcProp
       * @param {Object} target
       * @param {String} trgProp
       * @param {Function} changer
       */
      that.bind = (srcProp, target, trgProp, changer = ((v) => v)) => {
        if (binds[srcProp] == undefined) {
          binds[srcProp] = {
            main: undefined,
            targets: []
          };
        }
        binds[srcProp].targets.push({
          trg: target,
          prop: trgProp,
          changer: changer
        });

        if (that.hasOwnProperty(srcProp) && target.hasOwnProperty(trgProp)) {
          let lastProp = Object.getOwnPropertyDescriptor(that, srcProp);
          if (binds[srcProp].main === undefined) {
            binds[srcProp].main = lastProp;
          }
          Object.defineProperty(that, srcProp, {
            enumerable: lastProp.enumerable,
            configurable: true,
            get() {
              if (lastProp.hasOwnProperty("get")) {
                return lastProp.get.bind(that)();
              } else if (lastProp.hasOwnProperty("value")) {
                return lastProp.value;
              }
            },
            set(v) {
              if (lastProp.hasOwnProperty("set")) {
                lastProp.set.bind(that)(v);
              } else if (lastProp.hasOwnProperty("value")) {
                lastProp.value = v;
              }
              forEach(binds[srcProp].targets, (trg) => {
                trg.trg[trg.prop] = trg.changer(v);
              });
            }
          });
        }
      };

      /**
       * @param {String} srcProp
       * @param {Object|Function} target
       * @param {String} trgProp
       */
      // that.unbind = function (srcProp, target, trgProp) {
      that.unbind = (srcProp, target, trgProp) => {
        if (
          binds[srcProp] != "" &&
          binds[srcProp] != undefined &&
          binds[srcProp] != null
        ) {
          let result = [];
          let main = binds[srcProp].main;
          forEach(binds[srcProp].targets, (trg) => {
            if (
              (
                target != undefined &&
                target != null &&
                target != trg.trg
              ) || (
                trgProp != "" &&
                trgProp != undefined &&
                trgProp != null &&
                trgProp != trg.prop)
            ) {
              result.push(trg);
            }
          });
          binds[srcProp].target = result;

          if (binds[srcProp].target.length == 0) {
            Object.defineProperty(that, srcProp, main);
            delete binds[srcProp];
          }
        } else {
          forEach(binds, (b, idx) => {
            that.unbind(idx, target, trgProp);
          });
        }
      };

      /**
       * @param {String} prop
       * @param {Function} callback
       */
      that.watch = (prop, callback) => {
        if (watchs[prop] == undefined) {
          watchs[prop] = {
            main: undefined,
            callbacks: []
          };
        }
        watchs[prop].callbacks.push(callback);

        if (that.hasOwnProperty(prop)) {
          let lastProp = Object.getOwnPropertyDescriptor(that, prop);
          if (watchs[prop].main === undefined) {
            watchs[prop].main = lastProp;
          }
          Object.defineProperty(that, prop, {
            enumerable: lastProp.enumerable,
            configurable: true,
            get() {
              if (lastProp.hasOwnProperty("get")) {
                return lastProp.get.bind(that)();
              } else if (lastProp.hasOwnProperty("value")) {
                return lastProp.value;
              }
            },
            set(v) {
              if (lastProp.hasOwnProperty("set")) {
                lastProp.set.bind(that)(v);
              } else if (lastProp.hasOwnProperty("value")) {
                lastProp.value = v;
              }
              forEach(watchs[prop].callbacks, (cb) => {
                cb(v);
              });
            }
          });
        }
      };

      /**
       * 
       * @param {String} prop 
       * @param {Function} callback 
       */
      that.unwatch = (prop, callback) => {
        if (
          watchs[prop] != "" &&
          watchs[prop] != undefined &&
          watchs[prop] != null
        ) {
          let result = [];
          let main = watchs[prop].main;
          forEach(watchs[prop].callbacks, (cb) => {
            if (
              (callback != undefined) &&
              (callback != null) &&
              (callback != cb)
            ) {
              result.push(cb);
            }
          });
          watchs[prop].callbacks = result;

          if (watchs[prop].callbacks.length == 0) {
            Object.defineProperty(that, prop, main);
            delete watchs[prop];
          }
        } else {
          forEach(watchs, (b, idx) => {
            that.unwatch(idx, callback);
          });
        }
      };
    };
  }
}