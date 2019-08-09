import {
  Tigerian,
  instanceOf,
  forEach
} from "./Tigerian.js";
import {
  View
} from "../model_view/View.js";

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
    var routesList = {};
    var lastRoute = "";
    var viewPageNotFound;
    var that = this;

    useHashTag = (useHashTag === false) ? false : true;

    var getPath = function (path) {
      if (path.startsWith(applicationRoot)) {
        return path.slice(applicationRoot.length);
      } else {
        return path;
      }
    };

    var getGoodPath = function (path) {
      if (instanceOf(path, String)) {
        path = path.replace(/^\/*#?\/*([^\/].*[^\/])\/*$/, "$1");
        if ((path !== "") && (path !== "/")) {
          // path = path + "/";
        } else {
          path = "/";
        }
      } else {
        path = "/";
      }

      return path;
    };

    var getBestMatch = function (path) {
      if (path in routesList) {
        return [path, {}];
      } else {
        var params = {};
        for (var route in routesList) {
          var groups = [];
          var r = route.replace(/\{(\w+)\}/g, function () {
            this.push(arguments[1]);
            return "(\\w+)";
          }.bind(groups));
          var reg = new RegExp("^" + r + "$");
          var match = reg.exec(path);

          if (match) {
            for (var i = 1; i < match.length; i++) {
              params[groups[i - 1]] = match[i];
            }

            return [route, params];
          }
        }
      }
    };

    applicationRoot = getGoodPath(applicationRoot) + (useHashTag ? "#/" : "");

    /**
     * @param {string|string[]} routes
     * @param {View} view
     */
    this.defineMethod("add", (view, ...routes) => {
      for (var i = 0; i < routes.length; i++) {
        routesList[getGoodPath(routes[i])] = view;
      }
      /* if ((instanceOf(routes, String) || instanceOf(routes, Array)) && instanceOf(view, View)) {
          if (!instanceOf(routes, Array)) {
              routes = [routes];
          }

          for (var i = 0; i < routes.length; i++) {
              routes[getGoodPath(routes[i])] = view;
          }
      } */
    }, [View]);

    /**
     * @param {string|string[]} [route]
     */
    this.defineMethod("remove", (...routes) => {
      /* if (!instanceOf(route, Array)) {
        route = Array.from(arguments);
      } */
      for (var i = 0; i < route.length; i++) {
        delete routes[getGoodPath(route[i])];
      }
    });

    this.defineMethod("removeAll", () => {
      for (var i = 0; i < routesList.length; i++) {
        delete routesList[getGoodPath(routesList[i])];
      }
    });

    /**
     * @param {string} route
     */
    this.defineMethod("redirect", (route) => {
      route = getGoodPath(route);

      if (instanceOf(route, String) && (route !== "") && (route !== "/") && (route !== "#")) {
        if (useHashTag) {
          // var separator = (applicationRoot.startsWith("/") ? "" : "/");
          // window.location.href = window.location.origin + separator + applicationRoot + route;
          window.location.hash = "/" + route;
        } else {
          window.history.pushState({}, undefined, applicationRoot + route);
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
      var url = getGoodPath(window.location.pathname + (useHashTag ? window.location.hash : ""));
      var check = getBestMatch(getGoodPath(getPath(url)));

      if (useHashTag && (check[0] === "/") && (window.location.hash !== "#/")) {
        window.location.hash = "/";
      }

      if (check) {
        var route = check[0];
        var params = check[1];

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
        var limit = [route.startsWith("/") ? 1 : 0, route.endsWith("/") ? route.length - 1 : route.length];
        var pureRoute = "/";
        var routeParts = [];
        if (limit[0] < limit[1]) {
          pureRoute = route.substring(limit[0], limit[1]);
          routeParts = pureRoute.split("/");
        }

        routesList[route].refresh(params, pureRoute, routeParts);
        routesList[route].show();

        lastRoute = route;
      } else {
        for (var r in routesList) {
          routesList[r].hide();
        }
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
        if (instanceOf(v, String)) {
          setBasePath(v);
        }
      },
    });

    /**
     * @member {View}
     */
    this.defineProperty("pageNotFound", {
      get() {
        return viewPageNotFound;
      },
      set(v) {
        if (instanceOf(v, View) || (v === undefined)) {
          viewPageNotFound = v;
        }
      },
    });

    this.defineProperty("current", {
      get() {
        return lastRoute;
      },
      set(v) {
        that.redirect(v);
      }
    })

    window.onhashchange = (e) => {
      if (useHashTag) {
        that.render();
      }
    };

    window.onpopstate = (e) => {
      if (!useHashTag) {
        that.render();
      }
    };
  }
}