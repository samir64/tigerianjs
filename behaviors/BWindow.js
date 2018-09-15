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

        var windowSmallMatch = window.matchMedia("(max-width: 600px)");
        var windowMediumMatch = window.matchMedia("(min-width: 600px) and (max-width: 768px)");
        var windowNormalMatch = window.matchMedia("(min-width: 768px) and (max-width: 992px)");
        var windowLargeMatch = window.matchMedia("(min-width: 992px) and (max-width: 1200px)");
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