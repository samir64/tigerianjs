/**
 * Created by samir on 9/14/16.
 */

'use strict';


/**
 * @implements {Tigerian.Behavior}
 * @extends {Tigerian.Control}
 * @interface
 */
Tigerian.BGroup = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("group");

        //NOTE Private Members
        /**
         * @type {Tigerian.Control[]}
         */
        var items = [];
        // var superFocused = Object.getOwnPropertyDescriptor(this, "focused");

        //NOTE Properties
        /**
         * @member {number}
         */
        Object.defineProperty(this, "itemCount", {
            enumerable: true,
            configurable: true,

            get: function () {
                return items.length;
            }
        });

        //NOTE Public Functions
        /**
         * @param {Tigerian.Control} item
         */
        this.addItem = function (item) {
            if (Tigerian.Class.isInstance(item, Tigerian.Control)) {
                items.push(item);
            } else {
                throw new TypeError("Item type doesn't match to Generic Type");
            }
        };

        /**
         * @param {number} itemIndex
         * @returns {Tigerian.Control}
         */
        this.getItem = function (itemIndex) {
            if ((Tigerian.Class.isInstance(itemIndex, "number")) && (itemIndex >= 0) && (itemIndex < items.length)) {
                return items[itemIndex];
            }
        };

        /**
         * @param {number} itemIndex
         */
        this.removeItem = function (itemIndex) {
            if ((Tigerian.Class.isInstance(itemIndex, "number")) && (itemIndex >= 0) && (itemIndex < items.length)) {
                items = items.filter(function (item, index) {
                    if (index !== itemIndex) {
                        return item;
                    } else {
                        item.remove();
                    }
                });
            }
        };

        this.clear = function () {
            items = items.filter(function (item, itemIndex) {
                item.remove();
            });
        };

        /**
         * @param {function} func
         */
        this.sort = function (func) {
            items = items.sort(func);
        };
    },
    config: function (behavior, ctrlGroup) {
        if (behavior === "group") {

            var items = [];
            var i;

            if (!(Tigerian.Class.isInstance(ctrlGroup, Tigerian.Control) && ctrlGroup["Behavior:group"])) {
                ctrlGroup = this;

                for (i = 0; i < this.itemCount; i++) {
                    items.push(this.getItem(i));
                }
            } else {
                for (i = 0; i < ctrlGroup.itemCount; i++) {
                    items.push(ctrlGroup.getItem(i));
                }

                for (i = 0; i < this.itemCount; i++) {
                    items.push(this.getItem(i));
                }

                this.addControl = ctrlGroup.addGeneralControl.bind(this);
                this.addItem = ctrlGroup.addItem.bind(this);
                this.getItem = ctrlGroup.getItem.bind(this);
                this.removeItem = ctrlGroup.removeItem.bind(this);
            }

            if (Tigerian.Class.isInstance(ctrlGroup, Tigerian.Control) && ctrlGroup["Behavior:group"]) {
                //NOTE Alias Super Members
                var initAddItem = this.addItem.bind(this);
                var superAddControl = this.addControl.bind(this);
                var initSort = ctrlGroup.sort.bind(this);
                var superFocused = Object.getOwnPropertyDescriptor(ctrlGroup, "focused");
                var initItemCount = Object.getOwnPropertyDescriptor(ctrlGroup, "itemCount");

                this.addGeneralControl = ctrlGroup.addControl.bind(this);

                function addItem(item) {
                    if (Tigerian.Class.isInstance(item, Tigerian.Control)) {
                        initAddItem(item);
                        superAddControl(item);

                        return true;
                    }

                    return false;
                }

                /**
                 * @member {number}
                 */
                Object.defineProperty(this, "itemCount", {
                    enumerable: true,
                    configurable: true,
                    get: initItemCount.get.bind(this),
                });

                /**
                 * @member {boolean}
                 */
                Object.defineProperty(this, "focused", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var isActive = superFocused.get();
                        for (var i = 0;
                            (i < ctrlGroup.itemCount) && !isActive; i++) {
                            isActive = ctrlGroup.getItem(i).focused;
                        }
                        return isActive;
                    },
                    set: function (v) {
                        if (Tigerian.isInstance(v, "boolean")) {
                            superFocused.set(v);
                        }
                    },
                });

                /**
                 * @param {Tigerian.Control} item
                 */
                this.addControl = this.addItem = function (item) {
                    if (addItem(item)) {
                        this.dispatchEvent(Tigerian.Event.onItemAdded, {
                            "addedItem": item
                        });
                        // if (this !== ctrlGroup) {
                        //     ctrlGroup.dispatchEvent(Tigerian.Event.onItemAdded, {
                        //         "addedItem": item
                        //     });
                        // }
                    }
                };

                /**
                 * @param {function} func 
                 */
                this.sort = function (func) {
                    initSort(func);

                    for (var i = 0, cnt = ctrlGroup.itemCount; i < cnt; i++) {
                        var item = ctrlGroup.getItem(0);
                        ctrlGroup.removeItem(0);
                        ctrlGroup.addItem(item);
                    }
                }

                this.clear();
                if (ctrlGroup !== this) {
                    ctrlGroup.clear();
                }

                for (var i = 0, cnt = items.length; i < cnt; i++) {
                    var item = items[i];
                    // this.removeItem(0);
                    ctrlGroup.addItem(item);
                }
            }
        }
    }
});