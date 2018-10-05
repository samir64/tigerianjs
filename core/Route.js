'use strict';

/**
 * @class
 * @constructor
 */
Tigerian.Route = Tigerian.Class.extend({
    /**
     * @constructs
     * @param {string} applicationRoot
     */
    init: function (applicationRoot) {
        /**
         *
         * @type {Tigerian.View[]}
         */
        var routes = [];
        var lastRoute = "";
        var viewPageNotFound;

        var getPath = function (path) {
            if (path.startsWith(applicationRoot)) {
                return path.slice(applicationRoot.length);
            }
        };

        var getGoodPath = function (path) {
            if (typeof path === "string") {
                path = path.replace(/^\/*(.*[^\/])\/*/, "$1");
                if (path !== "/") {
                    path = "/" + path;
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

        applicationRoot = getGoodPath(applicationRoot);

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
            if ((typeof route === "string") && (route !== "") && (route !== "/") && (route !== "#")) {
                var info = route.split("#");
                if (info[0] === "") {
                    info[0] = "/";
                }
                if (getPath(window.location.pathname) === info[0]) {
                    window.location.hash = info[1];
                } else {
                    window.location.href = window.location.origin + applicationRoot + route;
                }
            } else {
                window.location.hash = "";
            }
        };

        this.render = function () {
            var url = window.location.pathname + window.location.hash;
            var check = getBestMatch(getGoodPath(getPath(url)));
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
                routes[route].refresh(params);
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
                return viewPageNoteFound;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, Tigerian.View) || (v === undefined)) {
                    viewPageNotFound = v;
                }
            },
        });

        window.onhashchange = function (e) {
            this.render();
        }.bind(this);
    },
});