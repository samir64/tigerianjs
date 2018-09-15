/**
 * Created by samir on 9/14/16.
 */

'use strict';


/**
 * @implements {Tigerian.Behavior}
 * @extends {Tigerian.Control}
 * @interface
 */
Tigerian.BFilter = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("filter");

        var filter = false;

        /**
         * @member {boolean}
         * @this {Tigerian.Control}
         */
        Object.defineProperty(this, "filter", {
            enumerable: true,
            configurable: true,
            get: function () {
                return filter;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    filter = v;
                }
            },
        });
    },
    config: function (behavior, ctrlFilter) {
        if ((behavior === "filter") && this["Behavior:group"] && Tigerian.Class.isInstance(this, Tigerian.Control) && Tigerian.Class.isInstance(ctrlFilter, Tigerian.Control) && ctrlFilter["Behavior:text"]) {
            var instance = this;

            // this.addGeneralControl(ctrlFilter);

            this.setAttribute("filter", this.filter ? "true" : "false");

            function filter() {
                if (instance.filter) {
                    for (var i = 0; i < instance.itemCount; i++) {
                        instance.getItem(i).visible = ((ctrlFilter.text === "") || instance.getItem(i).text.toLowerCase().includes(ctrlFilter.text.toLowerCase()));
                    }
                }
            }

            /**
             * @member {boolean}
             * @this {Tigerian.Control}
             */
            Object.defineProperty(this, "filter", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return (this.getAttribute("filter") === "true");
                },
                set: function (v) {
                    if (Tigerian.Class.isInstance(v, "boolean")) {
                        this.setAttribute("filter", (v === true) ? "true" : "false");
                    }
                },
            });

            ctrlFilter.addEvent("input", function (e) {
                filter();
            });

            filter();

            ctrlFilter.addEvent("keydown", function (e) {
                switch (e.code) {
                    case "Space":
                        this.text += " ";
                        e.preventDefault();
                }
            });
        }
    },
});