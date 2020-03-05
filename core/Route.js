import { Tigerian, instanceOf, forEach } from "./Tigerian.js";
import { View } from "../model_view/View.js";

("use strict");

/**
 * @class
 * @constructor
 */
export class Route extends Tigerian {
  /**
   * @constructs
   * @param {string} applicationRoot
   * @param {boolean} useHashTag = true
   */
  constructor(applicationRoot, useHashTag = true) {
    super();

    /**
     *
     * @type {View[]}
     */
    let routesList = {};
    let lastRoute = "";
    let viewPageNotFound;
    let that = this;

    useHashTag = useHashTag === false ? false : true;

    /* let getPath = (path) => {
      if (path.startsWith(applicationRoot)) {
        return path.slice(applicationRoot.length);
      } else {
        return path;
      }
    };

    let getGoodPath = function (path, addSlash = false) {
      if (instanceOf(path, String)) {
        path = path.replace(/^\/*#?\/*([^\/].*[^\/])\/*$/, "$1");
        if ((path !== "") && (path !== "/")) {
          if (addSlash === true) {
            path += "/";
          }
        } else {
          path = "/";
        }
      } else {
        path = "/";
      }

      return path;
    };

    let getBestMatch = (path) => {
      if (path in routesList) {
        return [path, {}];
      } else {
        let params = {};
        for (let route in routesList) {
          let groups = [];
          let r = route.replace(/\{(\w+)\}/g, () => {
            this.push(arguments[1]);
            return "(\\w+)";
          }.bind(groups));
          let reg = new RegExp("^" + r + "$");
          let match = reg.exec(path);

          if (match) {
            for (let i = 1; i < match.length; i++) {
              params[groups[i - 1]] = match[i];
            }

            return [route, params];
          }
        }
      }
    }; */

    let getClearPath = path => {
      return path
        .replace(/^[\/#]+/, "")
        .replace(/[\/#?]+$/, "")
        .replace(/\/{2,}/, "/");
    };

    let findRoute = path => {
      if (path.startsWith(applicationRoot)) {
        path = getClearPath(path.substring(applicationRoot.length));

        if (path in routesList) {
          return {
            index: path,
            path,
            route: routesList[path],
            params: {}
          };
        } else {
          let result;

          forEach(routesList, (route, index) => {
            let params = {};
            let groups = [];
            let r = index.replace(/\{([\w-]+)\}/g, (text, varName) => {
              groups.push(varName);
              return "([\\w-]+)";
            });
            let reg = new RegExp("^" + r + "$");
            let match = reg.exec(path);

            if (match) {
              for (let i = 1; i < match.length; i++) {
                params[groups[i - 1]] = match[i];
              }

              result = {
                index,
                path,
                route,
                params
              };
            }
          });

          return result;
        }

        /* forEach(routesList, (route, index) => {
          console.log({ applicationRoot, path, route, index });
        }); */
      }
    };

    // applicationRoot = getGoodPath(applicationRoot, true) + (useHashTag ? "#/" : "");

    applicationRoot = getClearPath(applicationRoot);

    /**
     * @param {string|string[]} routes
     * @param {View} view
     */
    this.defineMethod(
      "add",
      (view, ...routes) => {
        for (let i = 0; i < routes.length; i++) {
          routesList[getClearPath(routes[i])] = view;
          // routesList[getGoodPath(routes[i])] = view;
        }
        /* if ((instanceOf(routes, String) || instanceOf(routes, Array)) && instanceOf(view, View)) {
          if (!instanceOf(routes, Array)) {
              routes = [routes];
          }

          for (let i = 0; i < routes.length; i++) {
              routes[getGoodPath(routes[i])] = view;
          }
      } */
      },
      [View]
    );

    /**
     * @param {string|string[]} [route]
     */
    this.defineMethod("remove", (...routes) => {
      /* if (!instanceOf(route, Array)) {
        route = Array.from(arguments);
      } */
      for (let i = 0; i < route.length; i++) {
        delete routes[getClearPath(route[i])];
        // delete routes[getGoodPath(route[i])];
      }
    });

    this.defineMethod("removeAll", () => {
      for (let i = 0; i < routesList.length; i++) {
        delete routesList[getClearPath(routesList[i])];
        // delete routesList[getGoodPath(routesList[i])];
      }
    });

    /**
     * @param {string} route
     */
    this.defineMethod("redirect", route => {
      // route = getGoodPath(route);
      route = getClearPath(route);

      if (
        instanceOf(route, String) &&
        route !== "" &&
        route !== "/" &&
        route !== "#"
      ) {
        if (useHashTag) {
          // let separator = (applicationRoot.startsWith("/") ? "" : "/");
          // window.location.href = window.location.origin + separator + applicationRoot + route;
          window.location.hash = "/" + route;
        } else {
          window.history.pushState({}, undefined, route);
          that.render();
        }
      } else {
        if (useHashTag) {
          window.location.hash = "/";
        } else {
          window.history.pushState({}, undefined, applicationRoot);
          that.render();
        }
      }
    });

    this.defineMethod("render", () => {
      let routeCheck = findRoute(
        getClearPath(
          window.location.pathname + (useHashTag ? window.location.hash : "")
        )
      );

      /* let url = getGoodPath(window.location.pathname + (useHashTag ? window.location.hash : ""));
      let check = getBestMatch(getGoodPath(getPath(url)));
      console.log(applicationRoot, url, getPath(url), getGoodPath(getPath(url)), getBestMatch(getGoodPath(getPath(url))));

      if (useHashTag && (check[0] === "/") && (window.location.hash !== "#/")) {
        window.location.hash = "/";
      } */

      /* if (check) {
        let route = check[0];
        let params = check[1];

        if (instanceOf(viewPageNotFound, View)) {
          viewPageNotFound.hide();
        }

        if (lastRoute === "") {
          forEach(routesList, (rut, rname) => {
            if (rname !== route) {
              rut.hide();
            }
          });
        } else {
          routesList[lastRoute].hide();
        }
        let limit = [route.startsWith("/") ? 1 : 0, route.endsWith("/") ? route.length - 1 : route.length];
        let pureRoute = "/";
        let routeParts = [];
        if (limit[0] < limit[1]) {
          pureRoute = route.substring(limit[0], limit[1]);
          routeParts = pureRoute.split("/");
        }

        routesList[route].refresh(params, pureRoute, routeParts);
        routesList[route].show();

        lastRoute = route;
      } else {
        for (let r in routesList) {
          routesList[r].hide();
        }
        if (instanceOf(viewPageNotFound, View)) {
          viewPageNotFound.refresh();
          viewPageNotFound.show();
        }
      } */

      if (routeCheck) {
        if (instanceOf(viewPageNotFound, View)) {
          viewPageNotFound.hide();
        }

        if (lastRoute === "") {
          forEach(routesList, (route, index) => {
            if (route !== routeCheck.route) {
              route.hide();
            }
          });
        } else {
          lastRoute.hide();
        }

        let routeParts = [];
        routeParts = routeCheck.path.split("/");

        routeCheck.route.refresh(
          routeCheck.params,
          routeCheck.path,
          routeParts
        );
        routeCheck.route.show();

        lastRoute = routeCheck.route;
      } else {
        forEach(routesList, (route, index) => {
          route.hide();
        });

        if (instanceOf(viewPageNotFound, View)) {
          viewPageNotFound.refresh();
          viewPageNotFound.show();
        }
      }
    });

    /**
     * @member {string}
     */
    this.defineProperty("applicationRoot", {
      get() {
        return applicationRoot;
      },
      set(v) {
        setBasePath(v);
      },
      type: String
    });

    /**
     * @member {View}
     */
    this.defineProperty("pageNotFound", {
      get() {
        return viewPageNotFound;
      },
      set(v) {
        viewPageNotFound = v;
      },
      type: [View, undefined]
    });

    this.defineProperty("current", {
      get() {
        return lastRoute;
      },
      set(v) {
        that.redirect(v);
      },
      type: View
    });

    window.onhashchange = e => {
      if (useHashTag) {
        that.render();
      }
    };

    window.onpopstate = e => {
      if (!useHashTag) {
        that.render();
      }
    };
  }
}
