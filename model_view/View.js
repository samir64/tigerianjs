/**
 * Created by samir on 8/27/18.
 */

("use strict");


/**
 * @extends {Tigerian.ModelView}
 * @implements {Tigerian.BWindow}
 * @constructor
 */
Tigerian.View = Tigerian.ModelView.extend({
    /**
     * @constructs
     * @param {Tigerian.Control} container
     */
    init: function (container) {
        this.super();

        var show = function () {
            container.visible = true;
        };

        var hide = function () {
            container.visible = false;
        };

        var refresh = function (params) {};

        /**
         * @member {Function}
         */
        Object.defineProperty(this, "show", {
            enumerable: false,
            configurable: true,
            get: function () {
                return show;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    show = v;
                }
            },
        });

        /**
         * @member {Function}
         */
        Object.defineProperty(this, "hide", {
            enumerable: false,
            configurable: true,
            get: function () {
                return hide;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    hide = v;
                }
            },
        });

        /**
         * @member {Function}
         */
        Object.defineProperty(this, "refresh", {
            enumerable: false,
            configurable: true,
            get: function () {
                return refresh;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "function")) {
                    refresh = v;
                }
            },
        });
    }
}, Tigerian.BWindow);