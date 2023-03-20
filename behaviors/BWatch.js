import Behavior from "../core/Behavior.js";
import { Tigerian } from "../core/Tigerian.js";

export default class extends Behavior {
  #watches = {};

  #watch = (target, name, setter) => v => {
    setter?.bind?.(target)?.(v);
    this.#watches[name].forEach(watch => watch.bind(target)(v));
  }

  config(that) {
    const watch = (dis, path = []) => new Proxy(dis, {
      get(target, name) {
        switch (name) {
        case "?":
          return path;
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