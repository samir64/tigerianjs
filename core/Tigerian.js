// import Behavior from "./Behavior.js";
// import { BIterator } from "../behaviors/BIterator.js";
import BWatch from "../behaviors/BWatch.js";
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

const generateTextNodes = (el, nodes, defaults = {}) => {
  Array.from(el.children).forEach(e => {
    let elReplace;

    if (e.tagName.toLowerCase() === "style") {
      // const re = /<tg-text-node\s+name="(\w+)">([\s\S]*)<\/tg-text-node>/gm;
      const re = /<tg-text-node\s+name="([\w\.]+)"><\/tg-text-node>/gm;
      elReplace = document.createElement("style");
      const els = [];
      let found;
      let lastFound = {
        0: "",
        index: 0,
        input: e.innerText,
      };

      while (found = re.exec(e.innerText)) {
        const lastIndex = lastFound?.index ?? 0;
        const lastLength = lastFound?.[0]?.length ?? 0;
        const lastEndIndex = lastIndex + lastLength;
        const before = found.input.substr(lastEndIndex, found.index - lastEndIndex);

        const elBefore = document.createTextNode(before);
        elReplace.appendChild(elBefore);

        if (defaults[found[1]] instanceof HTMLElement) {
          const children = Array.from(defaults[found[1]].childNodes);
          children.forEach(child => {
            // elReplace.appendChild(child);
            const clonedChild = child.cloneNode(true);
            if (!child.reference) {
              child.reference = [clonedChild];
            } else {
              child.reference.push(clonedChild);
            }

            elReplace.appendChild(clonedChild);
          });

          nodes[found[1]] = document.createTextNode("");
        } else {
          // const elTextNode = document.createTextNode(found[2]);
          const elTextNode = document.createTextNode(defaults[found[1]]);
          if (!(found[1] in nodes)) {
            nodes[found[1]] = [elTextNode];
          } else {
            nodes[found[1]].push(elTextNode);
          }

          elReplace.appendChild(elTextNode);
        }

        lastFound = found;
      }

      const after = lastFound.input.substr(lastFound.index + lastFound[0].length);

      const elAfter = document.createTextNode(after);
      elReplace.appendChild(elAfter);
    } else if (e.tagName.toLowerCase() === "tg-text-node") {
      elReplace = e.firstChild ?? document.createTextNode(defaults[e.getAttribute("name")]);
      // nodes[e.getAttribute("name")] = elReplace;
      if (!(e.getAttribute("name") in nodes)) {
        nodes[e.getAttribute("name")] = [elReplace];
      } else {
        nodes[e.getAttribute("name")].push(elReplace);
      }
    }

    if (!!elReplace) {
      el.insertBefore(elReplace, e);
      el.removeChild(e);
    }

    generateTextNodes(e, nodes, defaults);
  });
};

const defineProperty = (that, key, nodes) => {
  const prop = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(that), key);

  const propNew = {
    get() {
      return prop?.get?.bind?.(that)?.();
    },
    set(v) {
      prop?.set?.bind?.(that)?.(v);

      nodes[key].forEach(node => {
        node.data = prop?.get?.bind?.(that)?.();
        if (!!node.reference) {
          node.reference.forEach(n => {
            n.data = node.data;
          })
        }
      });
      // nodes[key].data = prop?.get?.bind?.(that)?.();
    },
  };

  Object.defineProperty(that, key, propNew);
};

const attributeListener = (that, key, nodes) => {
  const keyName = ((key.type === "data") ? "data-" : "") + key;
  that.prop.listener[key.name] = val => {
    nodes[key.type + "." + key.name].forEach(node => {
      node.data = val;
    });
  }
  // that.attributeListener = attrs => {
  //   if (keyName in attrs) {
  //     nodes[key.type + "." + key].forEach(node => {
  //       node.data = attrs[keyName];
  //     });
  //   }
  // };
};

export const template = function (strings, ...keys) {
  return function (that) {
    const nodes = {};

    const result = [strings[0]];
    const el = document.createElement("div");
    const definedProperties = [];
    const defaults = {};

    keys.forEach((key, i) => {
      let value = key;

      if (key instanceof BindableVariable) {
        const definedProperty = definedProperties.some(p => (p.name === key.name) && (p.type === key.type));

        if (key.type === "prop") {
          value = `<tg-text-node name="prop.${key}"></tg-text-node>`;
          if (!definedProperty) {
            attributeListener(that, key, nodes);
            defaults[key] = that.prop[key];
          }
        } else if (key.type === "data") {
          value = `<tg-text-node name="data.${key}"></tg-text-node>`;
          if (!definedProperty) {
            attributeListener(that, key, nodes);
            defaults[key] = that.prop.data[key];
          }
        } else if (key.type === "public") {
          value = `<tg-text-node name="${key}"></tg-text-node>`;
          if (!definedProperty) {
            defaults[key] = that.data[key];
            that.data.listener[key] = () => {
              nodes[key].forEach(node => {
                node.data = that.data[key];
              });
            } 
          }
        }

        if (!definedProperty) {
          definedProperties.push(key);
        }
      }

      result.push(value, strings[i + 1]);
    });

    el.innerHTML = result.join("");
    generateTextNodes(el, nodes, defaults);

    // NOTE: This is a Proxy test for future and class binding in Tigerian
    // Object.defineProperty(that, "data", {
    //   get() {
    //     return new Proxy(that, {
    //       get(target, name) {
    //         return Reflect.get(target, name);
    //       },
    //       set(target, name, value) {
    //         Reflect.set(target, name, value);

    //         if (Object.keys(nodes).includes(name)) {
    //           nodes[name].data = Reflect.get(target, name);
    //         }

    //         return true;
    //       },
    //     });
    //   },
    // });

    return el;
  };
};

export const loadTemplate = templateUrl => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', templateUrl);
    xhr.overrideMimeType('text/xml');
    xhr.onreadystatechange = () => {
      if ((xhr.status === 200) && (xhr.readyState === xhr.DONE)) {
        const response = xhr.responseXML.documentElement;
        const result = document.createElement("div");

        Array.from(response.children).forEach(child => {
          result.appendChild(child);
        });

        resolve(eval("template`" + result.outerHTML + "`"));
      }
    }
    xhr.send();
  });
};

export class Tigerian {
  #el;

  constructor(el) {
    this.#el = el;
    this.abstract(Tigerian);
  }

  abstract(Type) {
    abstract(this, Type);
  }

  appendTo(parentElement, index) {
    if (index < 0) {
      index = this.#el.children.length + index;
    }
    parentElement.insertBefore(this.#el, Number.isInteger(index) ? parentElement.children[index] : null);
  }

  remove() {
    this.#el.parentNode.removeChild(this.#el);
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

export class BindableVariable {
  #name;
  #type;

  constructor(type, name) {
    this.#name = name;

    switch (type) {
      case "public":
      case "prop":
      case "data":
        this.#type = type;
        break;

      default:
    }
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  [["toString"]]() {
    return this.#name;
  }
}

export class BaseControl extends Tigerian {
  #el;
  #propData = {};
  #behaviors = [];
  #observerReducer = (res, cur) => ({...res, [cur.attributeName]: cur.target.getAttribute(cur.attributeName)});
  #attributeListeners = {};
  #elementObserver = p => {
    const changedAttributes = p.reduce(this.#observerReducer, {});
    const listenerKeys = Object.keys(this.#attributeListeners).filter(l => Object.keys(changedAttributes).includes(l));

    for (const listenerKey of listenerKeys) {
      this.#attributeListeners[listenerKey].forEach(attributeListener => attributeListener(changedAttributes[listenerKey]));
    }
  };

  constructor(el) {
    super(el);

    this.#el = el;

    const observer = new MutationObserver(this.#elementObserver);
    observer.observe(el, { attributes: true, });

    this.config(BWatch);
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

  // set attributeListener(v) {
  //   if (typeof v === "function") {
  //     this.#attributeListeners.push(v);
  //   }
  // }

  // removeAttributeListener(v) {
  //   this.#attributeListeners = this.#attributeListeners.filter(attributeListener => attributeListener !== v);
  // }

  getControl(query) {
    let result;

    const el = this.#el?.shadowRoot ?? this.#el;
    const nodes = Array.from(el.childNodes);

    if (Number.isInteger(query)) {
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
      this.#el.shadowRoot.insertBefore(control, Number.isInteger(index) ? this.#el.shadowRoot.children[index] : null);
    }
  }

  get prop() {
    const listener = new Proxy(this.#attributeListeners, {
      set(target, name, value) {
        if (typeof value === "function") {
          if (name in target) {
            target[name].push(value);
          } else {
            target[name] = [value];
          }
          return true;
        }
      }
    });

    const data = new Proxy(this.#propData, {
      get(target, name) {
        const result = target[name];
        return result;
      },
      set(target, name, value) {
        target[name] = value;
        return true;
      },
    });

    const result = new Proxy(this.#el, {
      get(target, name) {
        switch (name) {
        case "data":
          return data;
          break;

        case "classList":
          return target.classList;
          break;

        case "listener":
          return listener;
          break;

        default:
          return target.getAttribute(name);
        }
      },
      set(target, name, value) {
        switch(name) {
        default:
          target.setAttribute(name, value);
        }
        return true;
      },
    });

    return result;
  }

  get style() {
    return new Proxy(this.#el.style, {
      get(target, name) {
        if (name[0] === "$") {
          // TODO: It's a class list name
        } else {
          // TODO: It's an element's style
        }

        return;
      },
      set(target, name, value) {
        return true;
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
