/**
 * Created by samir on 9/7/18.
 */

'use strict';

/**
 * @extends {Tigerian.Behavior}
 * @interface
 */
Tigerian.BSelect = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("select");

        //NOTE Private Variables
        var autoSelect = true;
        var autoDeselect = true;
        this.selected = false;

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "autoSelect", {
            enumerable: true,
            configurable: true,
            get: function () {
                return autoSelect;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    autoSelect = v;
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "autoDeselect", {
            enumerable: true,
            configurable: true,
            get: function () {
                return autoDeselect;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    autoDeselect = v;
                }
            }
        });

    },
    config: function (behavior) {
        if ((behavior === "select") && Tigerian.Class.isInstance(this, Tigerian.Control)) {
            //NOTE Attributes
            this.setAttribute("selected", (this.selected ? "true" : "false"));


            //NOTE Properties
            /**
             * @member {boolean}
             */
            Object.defineProperty(this, "selected", {
                enumerable: true,
                configurable: true,

                get: function () {
                    return (this.getAttribute("selected") === "true");
                },

                set: function (v) {
                    if (Tigerian.Class.isInstance(v, "boolean")) {
                        this.setAttribute("selected", v);
                    }
                }
            });


            //NOTE Private Functions
            /**
             * @param {Event} e
             */
            function onClick(e) {
                var lastValue = this.selected;
                if (!this.selected) {
                    if (this.autoSelect) {
                        this.selected = true;
                    }
                } else {
                    if (this.autoDeselect) {
                        this.selected = false;
                    }
                }
                if (this.selected !== lastValue) {
                    this.dispatchEvent(Tigerian.Event.onSelectedChange, {lastValue: lastValue});
                }
            }

            /**
             * @param {Event} e
             */
            function onKeyDown(e) {
                var lastValue = this.selected;
                if (!this.selected) {
                    if (this.autoSelect && ((e.keyCode === 32) || (e.keyCode === 13))) {
                        this.selected = true;
                        e.preventDefault();
                        this.focus();
                    }
                } else {
                    if (this.autoDeselect && ((e.keyCode === 32) || (e.keyCode === 13))) {
                        this.selected = false;
                        e.preventDefault();
                        this.focus();
                    }
                }
                if (this.selected !== lastValue) {
                    this.dispatchEvent(Tigerian.Event.onSelectedChange, {lastValue: lastValue});
                }
            }


            //NOTE Default Events
            this.addEvent("click", onClick.bind(this));
            this.addEvent("keydown", onKeyDown.bind(this));
        }
    }
});
