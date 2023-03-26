import Behavior from "./Behavior.js";

String.prototype.toKebabCase = function () {
  let result = this[0].toLowerCase() + this.substr(1);
  result = result.replace(/([A-Z])/g, "-$1"); 
  result = result.toLowerCase();

  return result;
};

const superToString = Object.prototype.toString;

Object.prototype.toString = function(strings, ...keys) {
  if (!strings) {
    return superToString.bind(this)();
  }

  const dict = this;
  const result = [strings[0]];
  keys.forEach((key, i) => {
    const value = dict[key];
    result.push(value, strings[i + 1]);
  });
  return result.join("");
};

export function abstract(that, Type) {
  if (Type === undefined) {
    Type = that.constructor;
  }
  if (that.constructor === Type) {
    throw new Error(`${Type.name} is an abstract class.`);
  }
}

export function defineProxy(that, propertyName, data) {
  const events = {};

  const listener = (path = []) => new Proxy(events, {
    set(target, name, value) {
      const result = (typeof value === "function");
      if (!result) {
        return false;
      }

      const eventExists = name in events;
      const fullPath = [...path, name].join(".")

      if (!!eventExists) {
        events[fullPath].push(value);
      } else {
        events[fullPath] = [value];
      }

      return true;
    }
  });

  const proxy = (trg, path = []) => new Proxy(trg, {
    get(target, name) {
      if (typeof target[name] === "object") {
        return proxy(target[name], [...path, name]);
      } else {
        return target[name];
      }
    },
    set(target, name, value) {
      if (name[0] === "@") {
        name = name.substr(1);
        if (typeof value !== "function") {
          return false;
        }

        const fullPath = [...path, name].join(".")
        const eventExists = fullPath in events;

        if (!!eventExists) {
          events[fullPath].push(value);
        } else {
          events[fullPath] = [value];
        }
      } else {
        if (typeof target[name] === "object") {
          return false;
        }
        const fullPath = [...path, name].join(".")
        const cbs = events[fullPath] ?? [];
        const oldValue = target[name];
        target[name] = value;
        cbs.forEach(cb => cb({value, oldValue, fullPath}));
      }

      return true;
    }
  });

  Object.defineProperty(that, propertyName, {
    get() {
      return proxy(data);
    },
    configurable: false,
    enumerable: false,
  });
}

// export const loadTemplate = templateUrl => {
//   return new Promise((resolve, reject) => {
//     fetch(templateUrl)
//       .then(response => response.responseXML.documentElement)
//       .then(element => {
//         const result = document.createElement("div");

//         Array.from(element.children).forEach(child => {
//           result.appendChild(child);
//         });

//         resolve(eval("template`" + result.outerHTML + "`"));
//       });
//   });
// };

export class Tigerian {
  #el;

  constructor(el) {
    this.#el = el;
    const that = this;
    if (!("control" in el)) {
      Object.defineProperty(el, "control", {
        get() {
          return that;
        },
        enumerable: false,
        configurable: false,
      });
    }

    this.abstract(Tigerian);
  }

  abstract(Type) {
    abstract(this, Type);
  }

  parent() {
    const parent = this.#el.parentElement ?? this.#el.host;
    if (!!parent) {
      return parent.control ?? new this(parent);
    }
  }

  get index() {
    const parent = this.#el.parentElement ?? this.#el.host;
    console.log(parent, this.#el);
    return Array.from(parent?.childNodes ?? []).findIndex(node => node === this.#el);
  }

  appendTo(parentElement, index) {
    if (index < 0) {
      index = this.#el.children.length + index;
    }
    parentElement.insertBefore(this.#el, Number.isInteger(index) ? parentElement.children[index] : null);
  }

  remove(index) {
    const el = this.#el.shadowRoot ?? this.#el;
    if (Number.isInteger(index)) {
      if (index >= 0) {
        index = el.childNodes[index]
      } else {
        index += el.childNodes.length;
      }
    } else if (!(index instanceof HTMLElement)) {
      index = this.#el;
    }

    this.#el.parentNode.removeChild(index);
  }

  get event() {
    return new Proxy(this.#el, {
      set(target, name, value) {
        target.addEventListener(name, value);
        return true
      }
    });
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}

export class BaseControl extends Tigerian {
  #el;
  #propData = {};
  #events = {};
  #behaviors = [];
  #observerReducer = (res, cur) => ({...res, [cur.attributeName]: cur.target.getAttribute(cur.attributeName)});
  #attributeListeners = {};
  #elementObserver = p => {
    const changedAttributes = p.reduce(this.#observerReducer, {});
    const listenerKeys = Object.keys(this.#attributeListeners).filter(l => Object.keys(changedAttributes).includes(l));

    for (const listenerKey of listenerKeys) {
      this.#attributeListeners[listenerKey].forEach(attributeListener => attributeListener({
        value: changedAttributes[listenerKey],
        fullPath: "$" + listenerKey,
        oldValue: undefined,
      }));
    }
  };

  #getAttributes() {
    const result = {};

    for (var i = 0; i < this.#el.attributes.length; i++) {
        var attr = this.#el.attributes[i];
        result[attr.name] = attr.value;
        if (attr.name[0] !== "@") {
          this.data[attr.name] = attr.value;
        }
    }

    return result;
  }

  constructor(el) {
    super(el);

    this.#el = el;

    const observer = new MutationObserver(this.#elementObserver);
    observer.observe(el, { attributes: true, });

    const listeners = this.#attributeListeners;
    const mainElement = this.#el;
    const mainData = this.data ?? {};
    const that = this;

    Object.defineProperty(this, "data", {
      get: defineData,
      enumerable: true,
      configurable: false,
    });

    this.#getAttributes();

    function defineData() {
      const proxy = (trg, path = []) => new Proxy(trg, {
        get(target, name) {
          switch (name[0]) {
          case "$":
            if (path.length === 0) {
              return mainElement.getAttribute(name.substr(1));
            } else {
              throw "$ is not accessible here";
            }
            break;

          case "_":
            return path => {
              const paths = path.split(".");

              const result = paths.reduce((res, cur) => res?.[cur], target);

              return result;
            };

          default:
            if (typeof target[name] === "object") {
              return proxy(target[name], [...path, name]);
            } else {
              return target[name];
            }
          }
        },
        set(target, name, value) {
          const fullPath = [...path, name].join(".").replace(/^[$@]/, "").replace(/\.[$@]/g, ".");

          switch (name[0]) {
          case "@":
            if (typeof value !== "function") {
              return false;
            }

            if (fullPath in listeners) {
              listeners[fullPath].push(value);
            } else {
              listeners[fullPath] = [value];
            }
            break;

          case "$":
            if (path.length === 0) {
              name = name.substr(1);

              mainElement.setAttribute(fullPath, value);
              mainData[fullPath] = value;
            } else {
              return false;
            }
            break;

          default:
            const propertyPaths = [...path, name].reduce((res, cur) => {
              const last = res[res.length - 1];
              let result = "";

              if (!!last) {
                result = last.path;
                result += ".";
              }

              result += cur;

              res.push({
                property: last?.property?.[cur] ?? that.data[result],
                path: result,
              });

              return res;
            }, []).reverse();

            const finallProperty = propertyPaths[0].property;

            if (typeof target[name] === "object") {
              if (typeof value !== "object") {
                return false;
              }

              Object.entries(value).forEach(([k, v]) => {
                finallProperty[k] = v;
              });
            }

            const oldValue = target[name];
            target[name] = value;

            propertyPaths.forEach((propertyPath, index) => {
              const callbacks = listeners[propertyPath.path + ((index > 0) ? "*" : "")] ?? [];
              if (index === 0) {
                callbacks.push(...(listeners[propertyPath.path + "*"] ?? []));
              }

              callbacks.forEach(cb => cb({
                value,
                oldValue,
                fullPath,
                path: propertyPath.path,
              }));
            });
          }

          return true;
        },
      });

      return proxy(mainData);
    }
  }

  get classList() {
    return this.#el.classList;
  }

  config(behavior, ...params) {
    if (Object.getPrototypeOf(behavior) === Behavior) {
      this.#behaviors.push(behavior);
      const bhv = new behavior();
      bhv.config(this, ...params);
    }
  }

  used(behavior) {
    return this.#behaviors.includes(behavior.constructor);
  }

  getControl(query) {
    let result;

    const el = this.#el?.shadowRoot ?? this.#el;
    const nodes = Array.from(el.childNodes);

    if (query instanceof HTMLElement) {
      result = nodes.find(node => node === query);
    } else if (Number.isInteger(query)) {
      result = nodes[query];
    } else {
      result = el.querySelector(query);
    }

    if (result?.nodeName === "#text") {
      return new Text(result);
    }

    return !result ? undefined : (result.control ?? new BaseControl(result));
  }

  getControls(query) {
    let result;
    const el = this.#el?.shadowRoot ?? this.#el;
    const nodes = Array.from(el.childNodes);

    result = Array.from(el.querySelectorAll(query));

    return (result ?? []).map(node => {
      if (node.nodeName === "#text") {
        return new Text(node);
      }
      return !node ? undefined : (node.control ?? new BaseControl(node));
    });
  }

  append(control, index) {
    if (index < 0) {
      index = this.#el.children.length + index;
    }

    if (control instanceof Tigerian) {
      control.appendTo(this.#el, index);
    } else {
      const elRoot = this.#el.shadowRoot ?? this.#el;
      elRoot.insertBefore(control, Number.isInteger(index) ? elRoot.children[index] : null);
    }
  }

  clear() {
    const elRoot = this.#el.shadowRoot ?? this.#el;
    Array.from(elRoot.children).forEach(child => elRoot.removeChild(child));
  }

  replace(control, index = -1) {
    const ctrlReplaced = index === -1 ? this : this.getControl(index);
    const el = this.#el.shadowRoot ?? this.#el;
    const parent = (index >= 0 ? (el.control ?? new this(el)) : this.parent);
    if (index === -1) {
      index = this.#el;
    }
    if (!!parent) {
      parent.append(control, index);
      ctrlReplaced?.remove?.();
    }
  }

  addEvent(eventName, callback) {
    if (typeof callback !== "function") {
      return;
    }

    if (eventName[0] !== "@") {
      eventName = "@" + eventName;
    }
    
    if (!(eventName in this.#events)) {
      this.#events[eventName] = [];
    }
    this.#events[eventName].push(callback);
    this.#el.addEventListener(eventName, callback);
  }

  emit(eventName, value) {
    (this.#events["@" + eventName] ?? []).forEach(cb => cb(value));
  }

  get style() {
    return new Proxy(this.#el, {
      get(target, name) {
        if (name === "$") {
          return Array.from(target.classList);
        } else if (name[0] === "$") {
          return target.classList.contains(name.substr(1));
        } else {
          return new Proxy(target.style, {});
        }

        return;
      },
      set(target, name, value) {
        switch (name[0]) {
        case "$":
          name = name.substr(1);

          if ((value === "") || (value === 0)) {
            target.classList.toggle(name);
          } else if ((Number.isInteger(value) && (value > 0)) || (isNaN(value) && !!value)) {
            target.classList.add(name);
          } else {
            target.classList.remove(name);
          }
          return true;

        default:
          return Reflect.set(target.style, name, value);
        }
      }
    });
  }
}

export class Text extends Tigerian {
  #node;
  constructor(node) {
    if (!node) {
      node = document.createTextNode("");
    }
    super(node);
    this.#node = node;
  }

  get text() {
    return this.#node.data;
  }

  set text(value) {
    this.#node.data = value;
  }
}






















/**
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Boolean}
 */
// export function compare(obj1, obj2) {
//   if (typeof obj1 !== typeof obj2) {
//     return false;
//   }

//   if (obj1 instanceof Array && obj2 instanceof Array) {
//     if (obj1.length === obj2.length) {
//       return obj1.every((value, index) => {
//         if (value instanceof Array) {
//           if (obj2[index] instanceof Array) {
//             return compare(value, obj2[index]);
//           } else {
//             return false;
//           }
//         } else {
//           return compare(value, obj2[index]);
//         }
//       });
//     } else {
//       return false;
//     }
//   } else if (instanceOf(obj1, Object) && instanceOf(obj2, Object)) {
//     let result = true;

//     let key;
//     for (key in obj1) {
//       if (result) {
//         if (key in obj2) {
//           result = compare(obj1[key], obj2[key]);
//         } else {
//           result = false;
//         }
//       }
//     }

//     for (key in obj2) {
//       result = result && key in obj1;
//     }

//     return result;
//   } else {
//     return obj1 === obj2;
//   }
// }

/**
 * @param {Object} obj
 * @param {Function} type
 */
// export function instanceOf(obj, type) {
//   if (obj === undefined) {
//     return type === undefined;
//   }

//   if (typeof type === "string") {
//     return typeof obj === type;
//   } else if (typeof type === "function") {
//     let superClass = obj;
//     let result = false;

//     while (superClass !== null && !result) {
//       result = superClass.constructor === type;
//       superClass = Object.getPrototypeOf(superClass);
//     }

//     return result || obj instanceof type;
//   } else if (typeof type === "object") {
//     let typeReversed = Object.entries(type).reduce((result, entry) => {
//       result[entry[1]] = entry[0];
//       return result;
//     }, {});

//     return !!typeReversed[obj];
//   } else {
//     return false;
//   }
// }

/**
 * @param {Function} type1
 * @param {Function} type2
 */
// export function isA(type1, type2) {
//   let result;
//   if (instanceOf(type1, Function) && instanceOf(type2, Function)) {
//     let superClass = type1;

//     result = false;

//     do {
//       superClass = Object.getPrototypeOf(superClass);
//       result = superClass === type2;
//     } while (superClass !== null && !result);
//   }

//   return result;
// }

/**
 * @param {Object} obj
 * @param {Object} appendTo
 * @returns {Object}
 */
// export function clone(obj, appendTo) {
//   let result = {};

//   forEach(obj, (item, name, that) => {
//     let member = Object.getOwnPropertyDescriptor(that, name);
//     if (appendTo !== undefined) {
//       if ("value" in member) {
//         Object.defineProperty(appendTo, name, {
//           enumerable: member.enumerable,
//           configurable: member.configurable,
//           value: member.value,
//         });
//       } else {
//         Object.defineProperty(appendTo, name, {
//           enumerable: member.enumerable,
//           configurable: member.configurable,
//           get: member.get,
//           set: member.set,
//         });
//       }
//     }
//     if ("value" in member) {
//       Object.defineProperty(result, name, {
//         enumerable: member.enumerable,
//         configurable: member.configurable,
//         value: member.value,
//       });
//     } else {
//       Object.defineProperty(result, name, {
//         enumerable: member.enumerable,
//         configurable: member.configurable,
//         get: member.get,
//         set: member.set,
//       });
//     }
//   });

//   return result;
// }

/**
 * @callback FOREACH_CALLBACK
 * @param {*} value
 * @param {String|Number|Symbol} index
 * @param {Array|JSON|BIterator} source
 */
/**
 * @param {Object} obj
 * @param {FOREACH_CALLBACK} callback
 */
// export function forEach(obj, callback) {
//   if (callback instanceof Function) {
//     if (
//       (obj !== undefined &&
//         obj[Symbol.toStringTag] !== undefined &&
//         obj[Symbol.toStringTag].split(" ")[1] === "Iterator") ||
//       instanceOf(obj, BIterator)
//     ) {
//       for (let item of obj) {
//         callback(item, obj.iterator.index, obj);
//       }
//     } else if (obj !== undefined) {
//       for (let [index, value] of Object.entries(obj)) {
//         callback(value, index, obj);
//       }
//     }
//   }
// }

/**
 * @this {String}
 * @param {Number|String} ...params
 * @returns {String}
 */
// export function strFormat(str, ...params) {
//   if (params.length == 1 && typeof params[0] == "object") {
//     return str.replace(/\{(\w+)\}/g, (match, name, offset, mainStr) => {
//       return params[0][name] ? params[0][name] : "";
//     });
//   } else {
//     for (let i = 0, pat = /\{\}/g; pat.exec(str) != null; i++) {
//       str =
//         str.substr(0, pat.lastIndex - 2) +
//         "{" +
//         i.toString() +
//         "}" +
//         str.substr(pat.lastIndex);
//     }
//     return str.replace(/\{(\d+)\}/g, (match, number) => {
//       return params[number] !== undefined ? params[number] : match;
//     });
//   }
// }

/**
 * @param {Number|String} str
 * @param {Number} before
 * @param {Number} after
 * @returns {String}
 */
// export function padNumbers(str, before, after) {
//   return str
//     .toString()
//     .replace(
//       /(?:(\d+\.\d+)|(\d+)\.[^\d]?|[^\d]?\.(\d+)|(\d+)[^\.\d]?)/g,
//       (matched, two, left, right, pure) => {
//         if (two) {
//           left = two.split(".")[0];
//           right = two.split(".")[1];
//         }
//         if (pure) {
//           left = pure;
//         }

//         let result = matched;
//         let fix = "";
//         let i = 0;

//         if (left) {
//           if (!right) {
//             if (result[left.length] !== ".") {
//               fix = ".";
//             } else {
//               i = 1;
//             }

//             fix += "0".repeat(after);

//             result =
//               result.substring(0, left.length + i) +
//               fix +
//               result.substring(left.length + i);
//           }

//           if (before > left.length) {
//             result = result.padStart(result.length + before - left.length, "0");
//             // result = "0".repeat(before - left.length) + result;
//           }
//         }

//         if (right) {
//           if (!left) {
//             fix = "0".repeat(before);

//             result =
//               result.substring(0, result.length - right.length - 1) +
//               fix +
//               result.substring(result.length - right.length - 1);
//           }

//           if (after > right.length) {
//             result = result.padEnd(result.length + after - right.length, "0");
//             // result = result + "0".repeat(after - right.length);
//           }
//         }

//         return result;
//       }
//     );
// }

/**
 * @this {string}
 * @param {boolean} addHashSign true
 * @param {boolean} toLower true
 */
// export function strToTag(str, addHashSign = true, toLower = true) {
//   let result = str;

//   while (result[0] === "#") {
//     addHashSign = true;
//     result = result.substring(1);
//   }
//   result = result.replace(/[^\w]/g, "_");
//   return Array.from(result)
//     .map((ch, index, str) => {
//       if (ch >= "A" && ch <= "Z" && index > 0) {
//         ch = "_" + ch;
//       }
//       if (addHashSign !== false && index === 0) {
//         ch = "#" + ch;
//       }

//       if (toLower !== false) {
//         ch = ch.toLowerCase();
//       }

//       return ch;
//     })
//     .join("")
//     .replace(/_{2,}/g, "_");
// }

/**
 * @param {String} str
 * @returns {String}
 */
// export function strSplitCapital(str) {
//   let result = [];
//   for (let i = 0, s = 0; i <= str.length; i++) {
//     if (i === str.length || str[i].toUpperCase() === str[i]) {
//       if (i > 0 && str[i - 1].toUpperCase() !== str[i - 1]) {
//         result.push(str.substring(s, i).toLowerCase());
//         s = i;
//       }
//     }
//   }
//   return result;
// }

/**
 *
 * @param {Object} type
 * @param {Symbol} value
 * @returns {String}
 */
// export function enumToString(type, value) {
//   let result = Object.entries(type).find(([key, val]) => val === value);

//   return result ? result[0] : undefined;
// }

/**
 *
 * @param {String} str
 * @param {EStringCase} newCase
 */
// export function changeStringCase(newCase, str) {
//   // const re = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
//   const re = /[A-Z]{2,}[A-Z][0-9]*|[A-Z][a-z]*[0-9]*|[a-z]+[0-9]*/g;

//   const snakeCase = (value) =>
//     value
//       .match(re)
//       .map((x) => x.toLowerCase())
//       .join("_");

//   const kebabCase = (value) =>
//     value
//       .match(re)
//       .map((x) => x.toLowerCase())
//       .join("-");

//   const capitalCase = (value) =>
//     value
//       .match(re)
//       .map((x, index) =>
//         index === 0
//           ? x.toLowerCase()
//           : x.charAt(0).toUpperCase() + x.substr(1).toLowerCase()
//       )
//       .join("");

//   const pascalCase = (value) =>
//     value
//       .match(re)
//       .map((x) => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase())
//       .join("");

//   switch (newCase) {
//     case EStringCase.SNAKE_CASE:
//       return snakeCase(str);

//     case EStringCase.KEBAB_CASE:
//       return kebabCase(str);

//     case EStringCase.CAPITAL_CASE:
//       return capitalCase(str);

//     case EStringCase.PASCAL_CASE:
//       return pascalCase(str);

//     case EStringCase.LOWER_CASE:
//       return str.toLowerCase();

//     case EStringCase.UPPER_CASE:
//       return str.toUpperCase();

//     case EStringCase.UPPER_SNAKE_CASE:
//       return snakeCase(str).toUpperCase();

//     case EStringCase.UPPER_KEBAB_CASE:
//       return kebabCase(str).toUpperCase();

//     default:
//   }
// }

// export const EStringCase = Object.freeze({
//   SNAKE_CASE: Symbol("snake_case"),
//   KEBAB_CASE: Symbol("kebab_case"),
//   CAPITAL_CASE: Symbol("capital_case"),
//   PASCAL_CASE: Symbol("pascal_case"),
//   LOWER_CASE: Symbol("lower_case"),
//   UPPER_CASE: Symbol("upper_case"),
//   UPPER_SNAKE_CASE: Symbol("upper_snake_case"),
//   UPPER_KEBAB_CASE: Symbol("upper_kebab_case"),
// });
