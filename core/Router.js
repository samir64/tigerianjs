import { Control, template } from "./Control.js";

const notFound = path => class NotFound extends Control {
  get template() {
    return that => `<h1>Page not found ${path}</h1>`;
  }
}

const routes = {
  404: notFound,
};

const normalizePath = path => {
  let result = path.replace(/\/*$/, "").replace(/\/{2,}/g, "/");

  if (result[0] !== "/") {
    result = "/" + result;
  }

  return result;
}

export const route = (paths, ...controls) => {
  if (!controls.every(control => ((control.prototype instanceof Control) || (typeof control === "function")))) {
    throw "Controller invalid";
  }


  // const routes = {};
  paths = paths.slice(0, paths.length - 1);
  let prefix = "";

  paths.forEach((p, i) => {
    // console.log(111, p, controls[i], routes);

    if (!(controls[i].prototype instanceof Control)) {
      const cs = controls[i];
      const csPaths = cs.paths;
      const csControls = cs.controls;

      prefix = p;

      csPaths.forEach((csPath, csIdx) => {
        paths[i] = prefix + csPath;
        routes[normalizePath(prefix + csPath)] = csControls[csIdx];
        prefix += csPath;
      });

      // console.log(333, p, prefix, csPaths, csControls);

      // const cs = controls[i](["/"], routes[csBasePaths]);
      // const csPaths = cs.paths;
      // const csControls = cs.controls;

      // console.log(222, p, prefix, csBasePaths);

      // csPaths.forEach((csPath, csIdx) => {
      //   routes[normalizePath(p + csPath)] = csControls[csIdx];
      // });

    } else {
      p = p.replace(/\s/g, "");
      routes[normalizePath(prefix + p)] = controls[i];
      prefix += p;
    }
  });

  const result = (ps, ...cs) => {
    const paths = ps.map((p, i) => (i === 0) ? prefix + p : p);

    const result = route(paths, ...cs);
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

  // console.log(444, result.prefix, result.paths, result.controls, routes);

  return result;

  // return (ps, ...cs) => {
  //   const paths = ps.map((p, i) => (i === 0) ? prefix + p : p);

  //   const result = route(paths, ...cs);
  //   Object.defineProperty(result, "prefix", {
  //     get() {
  //       return prefix;
  //     },
  //     enumerable: false,
  //     configurable: false,
  //   });
  //   Object.defineProperty(result, "paths", {
  //     get() {
  //       return paths;
  //     },
  //     enumerable: false,
  //     configurable: false,
  //   });
  //   Object.defineProperty(result, "controls", {
  //     get() {
  //       return cs;
  //     },
  //     enumerable: false,
  //     configurable: false,
  //   });
  //   return result;
  // };
};

export const getRoute = (path) => {
  const control = routes[normalizePath(path)];

  console.log(control, path, routes);

  if (!!control && control.prototype instanceof Control) {
    return control;
  } else {
    // return routes[404](path);
  }
};
