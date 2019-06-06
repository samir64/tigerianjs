'use strict';

/**
 * @class
 * @constructor
 */
Tigerian.Route = Tigerian.Class.extend({
    /**
     * @constructs
     * @param {string} applicationRoot
     * @param {boolean} useHashTag
     */
    init: function (applicationRoot, useHashTag) {
        /**
         *
         * @type {Tigerian.View[]}
         */
        var routes = [];
        var lastRoute = "";
        var viewPageNotFound;

        this.super();

        useHashTag = (useHashTag === false) ? false : true;

        var getPath = function (path) {
            if (path.startsWith(applicationRoot)) {
                return path.slice(applicationRoot.length);
            }
        };

        var getGoodPath = function (path) {
            if (typeof path === "string") {
                path = path.replace(/^\/*(.*[^\/])\/*/, "$1");
                if ((path !== "") && (path !== "/")) {
                    path = path + "/";
                } else {
                    path = "/";
                }
            } else {
                path = "/";
            }

            return path;
        };

        var getBestMatch = function (path) {
            if (path in routes) {
                return [path, {}];
            } else {
                var params = {};
                for (var route in routes) {
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
         * @param {string|string[]} route
         * @param {Tigerian.View} view
         */
        this.add = function (route, view) {
            if ((Tigerian.Class.isInstance(route, "string") || Tigerian.Class.isInstance(route, Array)) && Tigerian.Class.isInstance(view, Tigerian.View)) {
                if (!(route instanceof Array)) {
                    route = [route];
                }

                for (var i = 0; i < route.length; i++) {
                    routes[getGoodPath(route[i])] = view;
                }
            }
        };

        /**
         * @param {string|string[]} [route]
         */
        this.remove = function (route) {
            if (!(route instanceof Array)) {
                route = Array.from(arguments);
            }
            for (var i = 0; i < route.length; i++) {
                delete routes[getGoodPath(route[i])];
            }
        };

        this.removeAll = function () {
            for (var i = 0; i < routes.length; i++) {
                delete routes[getGoodPath(routes[i])];
            }
        };

        /**
         * @param {string} route
         */
        this.redirect = function (route) {
            route = getGoodPath(route);

            if ((typeof route === "string") && (route !== "") && (route !== "/") && (route !== "#")) {
                if (useHashTag) {
                    window.location.href = window.location.origin + "/" + applicationRoot + route;
                } else {
                    window.history.pushState({}, undefined, route);
                    this.render();
                }
            } else {
                if (useHashTag) {
                    window.location.hash = "/";
                } else {
                    window.history.pushState({}, undefined, "/" + applicationRoot);
                    this.render();
                }
            }
        };

        this.render = function () {
            var url = getGoodPath(window.location.pathname + (useHashTag ? window.location.hash : ""));
            var check = getBestMatch(getGoodPath(getPath(url)));

            if (useHashTag && (check[0] === "/") && (window.location.hash !== "#/")) {
                window.location.hash = "/";
            }

            if (check) {
                var route = check[0];
                var params = check[1];

                if (Tigerian.Class.isInstance(viewPageNotFound, Tigerian.View)) {
                    viewPageNotFound.hide();
                }

                if (lastRoute === "") {
                    for (var r in routes) {
                        if (r !== route) {
                            routes[r].hide();
                        }
                    }
                } else {
                    routes[lastRoute].hide();
                }
                var pureRoute = route.substring((route.startsWith("/") ? 1 : 0), (route.endsWith("/") ? route.length - 1 : undefined));
                routes[route].refresh(params, pureRoute, pureRoute.split("/"));
                routes[route].show();

                lastRoute = route;
            } else {
                for (var r in routes) {
                    routes[r].hide();
                }
                if (Tigerian.Class.isInstance(viewPageNotFound, Tigerian.View)) {
                    viewPageNotFound.refresh();
                    viewPageNotFound.show();
                }
            }
        };

        /**
         * @member {string}
         */
        Object.defineProperty(this, "applicationRoot", {
            enumerable: false,
            configurable: true,
            get: function () {
                return applicationRoot;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "string")) {
                    setBasePath(v);
                }
            },
        });

        /**
         * @member {Tigerian.View}
         */
        Object.defineProperty(this, "pageNotFound", {
            enumerable: true,
            configurable: true,
            get: function () {
                return viewPageNotFound;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, Tigerian.View) || (v === undefined)) {
                    viewPageNotFound = v;
                }
            },
        });

        Object.defineProperty(this, "current", {
            enumerable: true,
            configurablte: true,
            get: function () {
                return lastRoute;
            },
            set: function (v) {
                this.redirect(v);
            }
        })

        window.onhashchange = window.onpopstate = function (e) {
            this.render();
        }.bind(this);
    },
});