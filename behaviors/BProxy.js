import Behavior from "../core/Behavior.js";

export default class extends Behavior {
  config(that, propertyName, data) {
    const events = {};

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
          let finallProperty = that[propertyName];
          [...path, name].forEach(pName => finallProperty = finallProperty[pName]);

          if (typeof target[name] === "object") {
            let result = (typeof value === "object");

            Object.entries(value).forEach(([k, v]) => {
              finallProperty[k] = v;
            });

            return result;
          }

          target[name] = value;

          // TODO: Call all parents' events

          const fullPath = [...path, name].join(".")
          const callbacks = events[fullPath] ?? [];
          const oldValue = target[name];

          callbacks.forEach(cb => cb({
            value,
            oldValue,
            fullPath,
          }));
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
}
