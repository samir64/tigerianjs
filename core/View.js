/**
 * Created by samir on 8/27/18.
 */

'use strict';


/**
 * @param {Tigerian.Model} model
 * @param {Tigerian.Control} container
 *
 * @extends Tigerian.ModelView
 * @constructor
 */
Tigerian.View = Tigerian.ModelView.extend({
    /**
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

        var refresh = function (params) {
        };

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
});
