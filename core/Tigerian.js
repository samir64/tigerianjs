// import "./String.js";
// import "./Object.js";
import "../style/Responsive.js";

import { Behavior } from "./Behavior.js";

("use strict");

export class Tigerian {
  constructor() {
    if (this.constructor === Tigerian) {
      throw new Error("Tigerian is an abstract class.");
    } else {
      Object.defineProperty(this, "behaviors", {
        enumerable: true,
        configurable: false,
        writable: true,
        value: []
      });

      var that = this;
      // var configs = [];

      /* behaviors.forEach(behavior => {
        if (
          behavior.prototype instanceof Behavior &&
          behavior.constructor !== Behavior
        ) {
          var obj = new behavior();
          this.behaviors.push(behavior);
          configs.push(obj.config);
          clone(obj, that);
          // Object.assign(this, new behavior().clone());
        }
      }); */

      Object.defineProperty(this, "config", {
        enumerable: true,
        configurable: true,
        value(behavior, ...params) {
          if (Object.getPrototypeOf(behavior) === Behavior) {
            this.behaviors.push(behavior);
            new behavior().config(that, ...params);

            /* that.behaviors.forEach((item, index) => {
              if (item === behavior) {
                configs[index](that, ...params);
              }
            }); */
          }
        }
      });
    }
  }
}

export function compare(obj1, obj2) {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (obj1 instanceof Array && obj2 instanceof Array) {
    if (obj1.length === obj2.length) {
      return obj1.every(function(value, index) {
        if (value instanceof Array) {
          if (obj2[index] instanceof Array) {
            return compare(value, obj2[index]);
          } else {
            return false;
          }
        } else {
          return compare(value, obj2[index]);
        }
      });
    } else {
      return false;
    }
  } else if (typeof obj1 === "object" && typeof obj2 === "object") {
    var result = true;

    var key;
    for (key in obj1) {
      if (result) {
        if (key in obj2) {
          result = compare(obj1[key], obj2[key]);
        } else {
          result = false;
        }
      }
    }

    for (key in obj2) {
      result = result && key in obj1;
    }

    return result;
  } else {
    return obj1 === obj2;
  }
}

export function instanceOf(obj, type) {
  if (typeof type === "string") {
    return typeof obj === type;
  } else if (typeof type === "function") {
    return obj instanceof type;
  } else {
    return false;
  }
}

export function isA(type1, type2) {}

export function clone(obj, appendTo) {
  var result = {};

  forEach(obj, (item, name, that) => {
    var member = Object.getOwnPropertyDescriptor(that, name);
    if (appendTo !== undefined) {
      if ("value" in member) {
        Object.defineProperty(appendTo, name, {
          enumerable: member.enumerable,
          configurable: member.configurable,
          value: member.value
        });
      } else {
        Object.defineProperty(appendTo, name, {
          enumerable: member.enumerable,
          configurable: member.configurable,
          get: member.get,
          set: member.set
        });
      }
    }
    if ("value" in member) {
      Object.defineProperty(result, name, {
        enumerable: member.enumerable,
        configurable: member.configurable,
        value: member.value
      });
    } else {
      Object.defineProperty(result, name, {
        enumerable: member.enumerable,
        configurable: member.configurable,
        get: member.get,
        set: member.set
      });
    }
  });

  return result;
}

export function forEach(obj, callback) {
  if (callback instanceof Function) {
    for (var index in obj) {
      callback(obj[index], index, obj);
    }
  }
}

/**
 * @this {String}
 * @param {*} ...params
 */
export function strFormat(str, ...params) {
  if (params.length == 1 && typeof params[0] == "object") {
    return str.replace(/\{(\w+)\}/g, function(match, name, offset, mainStr) {
      return params[0][name] ? params[0][name] : "";
    });
  } else {
    for (var i = 0, pat = /\{\}/g; pat.exec(str) != null; i++) {
      str =
        str.substr(0, pat.lastIndex - 2) +
        "{" +
        i.toString() +
        "}" +
        str.substr(pat.lastIndex);
    }
    return str.replace(/\{(\d+)\}/g, function(match, number) {
      return params[number] !== undefined ? params[number] : match;
    });
  }
}

/**
 * @param {String} str
 * @param {*} before
 * @param {*} after
 */
export function strPadNumbers(str, before, after) {
  return str.replace(
    /(?:(\d+\.\d+)|(\d+)\.[^\d]?|[^\d]?\.(\d+)|(\d+)[^\.\d]?)/g,
    function(matched, two, left, right, pure) {
      if (two) {
        left = two.split(".")[0];
        right = two.split(".")[1];
      }
      if (pure) {
        left = pure;
      }

      var result = matched;
      var fix = "";
      var i = 0;

      if (left) {
        if (!right) {
          if (result[left.length] !== ".") {
            fix = ".";
          } else {
            i = 1;
          }

          fix += "0".repeat(after);

          result =
            result.substring(0, left.length + i) +
            fix +
            result.substring(left.length + i);
        }

        if (before > left.length) {
          result = result.padStart(result.length + before - left.length, "0");
          // result = "0".repeat(before - left.length) + result;
        }
      }

      if (right) {
        if (!left) {
          fix = "0".repeat(before);

          result =
            result.substring(0, result.length - right.length - 1) +
            fix +
            result.substring(result.length - right.length - 1);
        }

        if (after > right.length) {
          result = result.padEnd(result.length + after - right.length, "0");
          // result = result + "0".repeat(after - right.length);
        }
      }

      return result;
    }
  );
}

/**
 * @this {string}
 * @param {boolean} addHashSign true
 * @param {boolean} toLower true
 */
export function strToTag(str, addHashSign, toLower) {
  var result = str;

  while (result[0] === "#") {
    addHashSign = true;
    result = result.substring(1);
  }
  result = result.replace(/[^\w]/g, "_");
  return Array.from(result)
    .map(function(ch, index, str) {
      if (ch >= "A" && ch <= "Z" && index > 0) {
        ch = "_" + ch;
      }
      if (addHashSign !== false && index === 0) {
        ch = "#" + ch;
      }

      if (toLower !== false) {
        ch = ch.toLowerCase();
      }

      return ch;
    })
    .join("")
    .replace(/_{2,}/g, "_");
}

/**
 * @param {string} prop
 */
export function strSplitCapital(str) {
  var result = [];
  for (var i = 0, s = 0; i <= str.length; i++) {
    if (i === str.length || str[i].toUpperCase() === str[i]) {
      if (i > 0 && str[i - 1].toUpperCase() !== str[i - 1]) {
        result.push(str.substring(s, i).toLowerCase());
        s = i;
      }
    }
  }
  return result;
}
