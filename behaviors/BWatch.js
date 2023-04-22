import Behavior from "../core/Behavior.js";
import { Tigerian } from "../core/Tigerian.js";

export default class extends Behavior {
  #watches = {};

  #reduceDataToProxy(res, cur) {
    const events = {};
    if (!res.value) {
      res.obj[res.key] = new Proxy({}, {
        get(target, name) {
          return Reflect.get(target, name);
        },
        set(target, name, value) {
          switch(name[0]) {
          case "@":
            if (typeof value !== "function") {
              return false;
            }
            name = name.substr(1);

            if (name in events) {
              events[name].push(value);
            } else {
              events[name] = [value];
            }

            return true;
            break;

          default:
            const oldValue = target[name];

            if (typeof target[name] === "object") {
              let result = (typeof value === "object");

              Object.entries(value).forEach(([k, v]) => {
                target[name][k] = v;
              });

              (events[name] ?? []).forEach(event => event({value, oldValue, name}));

              return result;
            }

            const result = Reflect.set(target, name, value);
            (events[name] ?? []).forEach(event => event({value, oldValue, name}));
            return result;
          }
        },
      });
      res.value = res.obj[res.key];
    }

    return {
      obj: res.value,
      key: cur,
      value: res.value[cur],
    }
  };

  #watch = (target, name, setter) => v => {
    setter?.bind?.(target)?.(v);
    this.#watches[name].forEach(watch => watch.bind(target)(v));
  }

  config(that, obj) {
    const reduceDataToProxy = this.#reduceDataToProxy;

    const watch = (dis, path = []) => new Proxy(dis, {
      get(target, name) {
        switch (name) {
        case "?":
          // return path;

          const data = path.reduce(reduceDataToProxy, {obj, key: "", value: obj});
          const value = (typeof data.value === "object") ? JSON.stringify(data.value) : data.value;
          const elNode = document.createTextNode(value);

          // data.obj["@" + data.key + "*"] = v => {
          data.obj["@" + data.key] = v => {
            // let value = data.obj[data.key];
            if (typeof v.value === "object") {
              v.value = JSON.stringify(v.value);
            }

            elNode.data = v.value;
          } 

          return elNode;
          break;

        default:
          return watch(target[name] ?? {}, [...path, name]);
        }
      }
    });

    Object.defineProperty(that, "watch", {
      get() {
        return watch({});
      }
    });
  }
}