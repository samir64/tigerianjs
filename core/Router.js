import { BaseControl } from "./Tigerian.js";
import { Control, template } from "./Control.js";

let useHashtag = true;

export default class Router {
  #useHashtag;
  #routes = {
    404: this.#notFound,
  };
  #onChangeRoutes = [];

  #normalizePath(path) {
    let result = path.replace(/\/*$/, "").replace(/\/{2,}/g, "/");

    if (result[0] !== "/") {
      result = "/" + result;
    }

    return result;
  }

  #notFound(path) {
    return class NotFound extends BaseControl {
      constructor() {
        const el = document.createElement("h1");
        super(el);

        el.innerHTML = `Page not found ${path}`;
      }
    }
  }

  constructor(useHashtag = true) {
    this.#useHashtag = !!useHashtag;
  }

  set onChangeRoute(v) {
    if (typeof v === "function") {
      this.#onChangeRoutes.push(v);
    }
  }

  route(paths, ...controls) {
    if (!controls.every(control => ((control.prototype instanceof BaseControl) || (typeof control === "function")))) {
      throw "Controller invalid";
    }

    paths = paths.slice(0, paths.length - 1);
    let prefix = "";

    paths.forEach((p, i) => {
      if (!(controls[i].prototype instanceof Control)) {
        const cs = controls[i];
        const csPaths = cs.paths;
        const csControls = cs.controls;

        prefix = p;

        csPaths.forEach((csPath, csIdx) => {
          prefix = this.#normalizePath(prefix + csPath);

          paths[i] = prefix;
          this.#routes[prefix] = csControls[csIdx];
        });
      } else {
        p = p.replace(/\s/g, "");
        prefix = this.#normalizePath(prefix + p);
        this.#routes[prefix] = controls[i];
      }
    });

    const result = (ps, ...cs) => {
      const paths = ps.map((p, i) => (i === 0) ? this.#normalizePath(prefix + p) : p);

      const result = this.route(paths, ...cs);
      return result;
    };

    Object.defineProperty(result, "prefix", {
      get() {
        return prefix;
      },
      enumerable: false,
      configurable: false,
    });
    Object.defineProperty(result, "paths", {
      get() {
        return paths;
      },
      enumerable: false,
      configurable: false,
    });
    Object.defineProperty(result, "controls", {
      get() {
        return controls;
      },
      enumerable: false,
      configurable: false,
    });

    return result;
  };

  redirect(path) {
    if (!!useHashtag) {
      window.location.hash = path;
    } else {
      history.pushState({}, undefined, path);
      this.checkRoute();
    }
  };

  getRoute(path) {
    path = this.#normalizePath(path);
    const foundRoute = Object.entries(this.#routes).map(([route, view]) => {
      const ptrRoute = route.replace(/\//g, "\\/").replace(/:(\w+)/g, "(?<$1>\\w+)");
      const reRoute = new RegExp("^" + ptrRoute + "$");

      if (reRoute.test(path)) {
        const reMatch = reRoute.exec(path);

        const result = {
          path,
          route,
          view,
          params: reMatch?.groups ?? {},
          query: {},
        };

        return result;
      }
    }).filter(route => !!route);

    const control = foundRoute?.[0]?.view ?? this.#routes[404](path);
    const result = new control();
    result.data.params = foundRoute?.[0]?.params ?? {};

    return result;
  };

  checkRoute() {
    let path;

    if (!!this.#useHashtag) {
      path = window.location.hash.substr(1);
    } else {
      path = window.location.href.substr(window.location.origin.length);
    }

    const result = this.getRoute(path);

    this.#onChangeRoutes.forEach(e => e(result, path));

    return result;
  };
};
