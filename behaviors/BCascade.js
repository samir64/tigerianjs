("use strict");

/**
 * @constructor
 * @extends {Behavior}
 */
BCascade = Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("cascade");


        /**
         * @param {Control|BGroup} child 
         */
        this.addChild = function (child) {};

        /**
         * @param {boolean} visible
         */
        this.viewSubmenu = function (visible) {};
    },
    config: function (behavior) {
        if (behavior === "cascade" && Class.isInstance(this, Control) && this["Behavior:cascade"]) {
            var ctrlSubMenu;

            var instance = this;
            // var superAddControl = this.addControl;
            var superClass = this.super;

            this.setAttribute("has-child", "false");
            this.setAttribute("open-child", "false");

            /**
             * @member {boolean}
             */
            Object.defineProperty(this, "hasChild", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return (this.getAttribute("has-child") === "true");
                },
            });

            /**
             * @param {boolean} visible
             */
            this.viewChild = function (visible) {
                if (instance.hasChild) {
                    if (Class.isInstance(visible, "boolean")) {
                        ctrlSubMenu.visible = visible;
                    } else {
                        ctrlSubMenu.visible = !ctrlSubMenu.visible;
                    }

                    this.setAttribute("open-child", (ctrlSubMenu.visible ? "true" : "false"));
                }
            };

            /**
             * @param {Control|BGroup} child 
             */
            this.addControl = this.addChild = function (child) {
                if (Class.isInstance(child, Control) && child["Behavior:group"]) {
                    ctrlSubMenu = child;
                    child.visible = false;
                    this.setAttribute("has-child", "true");
                    // superAddControl(child);
                    superClass.addControl(child);
                }
            };
        }
    },
});