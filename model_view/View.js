/**
 * Created by samir on 8/27/18.
 */

("use strict");


/**
 * @extends {ModelView}
 * @implements {BWindow}
 * @constructor
 */
View = ModelView.extend({
    /**
     * @constructs
     * @param {Control} container
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
                if (Class.isInstance(v, "function")) {
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
                if (Class.isInstance(v, "function")) {
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
                if (Class.isInstance(v, "function")) {
                    refresh = v;
                }
            },
        });
    }
}, BWindow);