/**
 * Created by samir on 9/14/16.
 */

("use strict");


/**
 * @implements {Behavior}
 * @extends {Control}
 * @interface
 */
BGroup = Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("group");

        //NOTE Private Members
        /**
         * @type {Control[]}
         */
        var items = {};
        // var superFocused = Object.getOwnPropertyDescriptor(this, "focused");
        this.config("iterator", items);

        //NOTE Properties
        /**
         * @member {number}
         */
        Object.defineProperty(this, "itemCount", {
            enumerable: true,
            configurable: true,

            get: function () {
                return items.list.length;
            }
        });

        //NOTE Public Functions
        /**
         * @param {Control} item
         */
        this.addItem = function (item) {
            if (Class.isInstance(item, Control)) {
                var found = false;

                items.list.forEach(function (it, index) {
                    if (item === it) {
                        found = true;
                    }
                });

                if (!found) {
                    items.list.push(item);
                }
            } else {
                throw new TypeError("Item type doesn't match to Generic Type");
            }
        };

        /**
         * @param {number} itemIndex
         * @returns {Control}
         */
        this.getItem = function (itemIndex) {
            if ((Class.isInstance(itemIndex, "number")) && (itemIndex >= 0) && (itemIndex < items.list.length)) {
                return items.list[itemIndex];
            }
        };

        /**
         * @param {number} itemIndex
         */
        this.removeItem = function (itemIndex) {
            if ((Class.isInstance(itemIndex, "number")) && (itemIndex >= 0) && (itemIndex < items.list.length)) {
                items.list = items.list.filter(function (item, index) {
                    if (index !== itemIndex) {
                        return item;
                    } else {
                        item.remove();
                    }
                });
            }
        };

        this.clear = function () {
            items.list = items.list.filter(function (item, itemIndex) {
                item.remove();
                return false;
            });
        };

        /**
         * @param {function} func
         */
        this.sort = function (func) {
            items.list = items.list.sort(func);
        };
    },
    /**
     * @param {string} behavior
     * @param {Control} ctrlGroup
     */
    config: function (behavior, ctrlGroup) {
        if (behavior === "group") {

            var items = [];
            var i;
            var instance = this;

            /* this.yield = function (index) {
                console.log(behavior, index, items);
                return items[index];
            }; */

            if (!(Class.isInstance(ctrlGroup, Control) && ctrlGroup["Behavior:group"])) {
                ctrlGroup = this;

                /* for (i = 0; i < this.itemCount; i++) {
                    items.push(this.getItem(i));
                } */
                this.forEach(function (item) {
                    items.push(item);
                });
            } else {
                /* for (i = 0; i < ctrlGroup.itemCount; i++) {
                    items.push(ctrlGroup.getItem(i));
                } */
                ctrlGroup.forEach(function (item) {
                    items.push(item);
                });

                /* for (i = 0; i < this.itemCount; i++) {
                    items.push(this.getItem(i));
                } */
                this.forEach(function (item) {
                    items.push(item);
                });

                this.addControl = ctrlGroup.addGeneralControl.bind(this);
                this.getItem = ctrlGroup.getItem.bind(this);
                this.removeItem = ctrlGroup.removeItem.bind(this);
                this.clear = ctrlGroup.clear.bind(this);
                this.next = ctrlGroup.next;
                this.last = ctrlGroup.last;
                this.first = ctrlGroup.first;
                Object.defineProperty(this, "value", {
                    enumerable: true,
                    configurable: true,
                    get: Object.getOwnPropertyDescriptor(ctrlGroup, "value").get,
                });
                Object.defineProperty(this, "index", {
                    enumerable: true,
                    configurable: true,
                    get: Object.getOwnPropertyDescriptor(ctrlGroup, "index").get,
                });
                Object.defineProperty(this, "yield", {
                    enumerable: false,
                    configurable: true,
                    get: Object.getOwnPropertyDescriptor(ctrlGroup, "yield").get,
                    set: Object.getOwnPropertyDescriptor(ctrlGroup, "yield").set,
                });
            }

            if (Class.isInstance(ctrlGroup, Control) && ctrlGroup["Behavior:group"]) {
                //NOTE Alias Super Members
                var superAddControl = this.addControl.bind(this);
                var initAddItem = ctrlGroup.addItem.bind(this);
                var initRemoveItem = ctrlGroup.removeItem.bind(this);
                var initSort = ctrlGroup.sort.bind(this);
                var superFocused = Object.getOwnPropertyDescriptor(ctrlGroup, "focused");
                var initItemCount = Object.getOwnPropertyDescriptor(ctrlGroup, "itemCount");

                this.addGeneralControl = ctrlGroup.addControl.bind(this);

                function addItem(item) {
                    if (Class.isInstance(item, Control)) {
                        initAddItem(item);
                        superAddControl(item);

                        // items.push(item);

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
                        if (isInstance(v, "boolean")) {
                            superFocused.set(v);
                        }
                    },
                });

                /**
                 * @param {Control} item
                 */
                this.addControl = this.addItem = function (item) {
                    if (addItem(item)) {
                        instance.dispatchEvent(Events.onAdd, {
                            "addedItem": item
                        });

                        item.addEvent("Remove", function (e) {
                            instance.forEach(function (it, index) {
                                if (item === it) {
                                    initRemoveItem(index);
                                }
                            });

                            instance.dispatchEvent(Events.onRemove, {
                                "removedItem": item
                            });
                        });
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
                };

                this.clear = function () {
                    while (this.itemCount > 0) {
                        this.removeItem(0);
                        items.pop();
                    }
                };

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
}, BIterator);