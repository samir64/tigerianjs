import Behavior from "./Behavior.js";

String.prototype.toKebabCase = function () {
  let result = this;
  // let result = this[0].toLowerCase() + this.substr(1);
  result = result.replace(/(\w)([A-Z])/g, "$1-$2"); 
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

  get parent() {
    // const parent = this.#el.parentElement ?? this.#el.host;
    const parent = this.#el.parentNode ?? this.#el.host;
    if (!!parent) {
      return parent.control ?? new BaseControl(parent);
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
  #baseUrl = "/";
  #baseUrlListeners = [];
  #visible = true;
  #replaceNode = document.createComment("Invisible Control");

  #baseUrlChange() {
    this.#baseUrlListeners.forEach(listener => listener(this.#baseUrl));
  }
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
    const attributes = this.#el.attributes ?? [];

    for (var i = 0; i < attributes.length; i++) {
        var attr = this.#el.attributes[i];
        result[attr.name] = attr.value;
        if (attr.name[0] !== "@") {
          this.data[attr.name] = attr.value;
        }

        if (attr.value[0] === "~") {
          const path = attr.value.substr(1).replace(/^\/*/, "");
          attr.value = this.#baseUrl + path;
          this.#baseUrlListeners.push(v => {
            attr.value = v + path;
          });
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

  get baseUrl() {
    return this.#baseUrl;
  }

  set baseUrl(v) {
    this.#baseUrl = v.replace(/^\/*/, "").replace(/\/*$/, "/");

    const controls = this.getControls("*");
    controls.forEach(control => control.baseUrl = this.#baseUrl);

    this.#baseUrlChange();
  }

  get visible() {
    return this.#visible;
  }

  set visible(v) {
    const lastVisible = this.#visible;
    this.#visible = !!v;

    if (this.#visible !== lastVisible) {
      if (!v) {
        const parent = this.#el.parentNode;
        parent.insertBefore(this.#replaceNode, this.#el);
        parent.removeChild(this.#el);
      } else {
        const parent = this.#replaceNode.parentNode;
        parent.insertBefore(this.#el, this.#replaceNode);
        parent.removeChild(this.#replaceNode);
      }
    }
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

    // const el = this.#el?.shadowRoot ?? this.#el;
    for (const el of [this.#el, this.#el.shadowRoot]) {
      if (!result) {
        const nodes = Array.from(el.childNodes);

        if (query instanceof HTMLElement) {
          result = nodes.find(node => node === query);
        } else if (Number.isInteger(query)) {
          result = nodes[query];
        } else {
          result = el.querySelector(query);
        }
      }
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

    const elRoot = this.#el.shadowRoot ?? this.#el;
    if (control instanceof Tigerian) {
      control.appendTo(elRoot, index);
    } else {
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
    this.#events[eventName].push(callback.bind(this));
    this.#el.addEventListener(eventName.substr(1), callback.bind(this));

    return this;
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
    let initValue = "";
    if (typeof node === "string") {
      initValue = node;
      node = undefined;
    }
    if (!node) {
      node = document.createTextNode(initValue);
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
