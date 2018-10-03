/**
 * Created by samir on 9/14/18.
 */

'use strict';

/**
 * @namespace {Tigerian}
 * @extends {Tigerian.Behavior}
 * @interface
 */
Tigerian.BWindow = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("window");

        var windowSmallMatch = window.matchMedia("(max-width: 575.98px)");
        var windowMediumMatch = window.matchMedia("(min-width: 576px) and (max-width: 767.98px)");
        var windowNormalMatch = window.matchMedia("(min-width: 768px) and (max-width: 991.98px)");
        var windowLargeMatch = window.matchMedia("(min-width: 992px) and (max-width: 1199.98px)");
        var windowXlargeMatch = window.matchMedia("(min-width: 1200px)");

        var onSmallWindow = function (e) {};
        var onMediumWindow = function (e) {};
        var onNormalWindow = function (e) {};
        var onLargeWindow = function (e) {};
        var onXlargeWindow = function (e) {};

        /**
         * @member {string}
         */
        Object.defineProperty(this, "windowSize", {
            enumerable: true,
            configurable: false,
            get: function () {
                if (windowSmallMatch.matches) {
                    return "Small";
                }

                if (windowMediumMatch.matches) {
                    return "Medium";
                }

                if (windowNormalMatch.matches) {
                    return "Normal";
                }

                if (windowLargeMatch.matches) {
                    return "Large";
                }

                if (windowXlargeMatch.matches) {
                    return "XLarge";
                }
            },
        });

        /**
         * @member {function}
         */
        Object.defineProperty(this, "onSmallWindow", {
            enumerable: false,
            configurable: false,
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    v = v.bind(this);
                    onSmallWindow = v;
                    if (windowSmallMatch.matches) {
                        v();
                    }
                }
            },
        });

        /**
         * @member {function}
         */
        Object.defineProperty(this, "onMediumWindow", {
            enumerable: false,
            configurable: false,
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    v = v.bind(this);
                    onMediumWindow = v;
                    if (windowMediumMatch.matches) {
                        v();
                    }
                }
            },
        });

        /**
         * @member {function}
         */
        Object.defineProperty(this, "onNormalWindow", {
            enumerable: false,
            configurable: false,
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    v = v.bind(this);
                    onNormalWindow = v;
                    if (windowNormalMatch.matches) {
                        v();
                    }
                }
            },
        });

        /**
         * @member {function}
         */
        Object.defineProperty(this, "onLargeWindow", {
            enumerable: false,
            configurable: false,
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    v = v.bind(this);
                    onLargeWindow = v;
                    if (windowLargeMatch.matches) {
                        v();
                    }
                }
            },
        });

        /**
         * @member {function}
         */
        Object.defineProperty(this, "onXlargeWindow", {
            enumerable: false,
            configurable: false,
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    v = v.bind(this);
                    onXlargeWindow = v;
                    if (windowXlargeMatch.matches) {
                        v();
                    }
                }
            },
        });

        windowSmallMatch.addListener(function (e) {
            if (e.matches) {
                onSmallWindow();
            }
        });

        windowMediumMatch.addListener(function (e) {
            if (e.matches) {
                onMediumWindow();
            }
        });

        windowNormalMatch.addListener(function (e) {
            if (e.matches) {
                onNormalWindow();
            }
        });

        windowLargeMatch.addListener(function (e) {
            if (e.matches) {
                onLargeWindow();
            }
        });

        windowXlargeMatch.addListener(function (e) {
            if (e.matches) {
                onXlargeWindow();
            }
        });
    },
});