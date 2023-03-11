import Behavior from "../core/Behavior.js";
import { Tigerian, BindableVariable } from "../core/Tigerian.js";

export default class extends Behavior {
  #watches = {};

  #watch = (target, name, setter) => v => {
    setter?.bind?.(target)?.(v);
    this.#watches[name].forEach(watch => watch.bind(target)(v));
  }

  config(that) {
    const watches = this.#watches;
    const watch = this.#watch;

    const data = new Proxy({}, {
      get(_, name) {
        return new BindableVariable("data", name);
      },
    });

    const prop = new Proxy({}, {
      get(_, name) {
        return new BindableVariable("prop", name);
      }
    });

    Object.defineProperty(that, "watch", {
      get() {
        return new Proxy(that, {
          get(_, name) {
            if (name === "prop") {
              return prop
            } else if (name === "data") {
              return data;
            } else {
              return new BindableVariable("public", name);
            }
          },
          set(target, name, val) {
            if (name in watches) {
              watches[name].push(val);
            } else {
              watches[name] = [val];

              const descriptor = Reflect.getOwnPropertyDescriptor(Reflect.getPrototypeOf(target), name);

              Object.defineProperty(that, name, {
                enumerable: true,
                configurable: true,
                get: descriptor?.get,
                set: watch(target, name, descriptor?.set),
              })
            }

            return true;
          }
        });
      }
    });
  }
}