/**
 * Created by samir on 9/10/18.
 */

("use strict");

/**
 * @extends {Tigerian.Behavior}
 * @implements {Tigerian.BGroup}
 * @interface
 */
Tigerian.BSelectGroup = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("select_group");

        //NOTE Private Variables
        var itemIndex = -1;
        var multi = false;

        //NOTE Properties
        /**
         * @member {number}
         */
        Object.defineProperty(this, "itemIndex", {
            enumerable: true,
            configurable: true,
            get: function () {
                return itemIndex;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "number")) {
                    if (v < -1) {
                        v = -1;
                    }
                    if (v >= this.itemCount) {
                        v = this.itemCount;
                    }

                    itemIndex = v;
                    // this.getItem(v).focus();
                    this.focus();
                }
            }
        });

        /**
         * @member {number|number[]}
         */
        Object.defineProperty(this, "selectedIndex", {
            enumerable: true,
            configurable: true,
            get: function () {
                /**
                 * @type {number|number[]}
                 */
                var result = (multi ? [] : -1);
                for (var i = 0; i < this.itemCount; i++) {
                    if (this.getItem(i).selected) {
                        if (multi) {
                            result.push(i);
                        } else {
                            if (result === -1) {
                                result = i;
                            } else {
                                this.getItem(i).selected = false;
                            }
                        }
                    }
                }
                return result;
            },
            /**
             * @param {number|number[]} v
             */
            set: function (v) {
                if ((v === -1) || (v === [])) {
                    for (var i = 0; i < this.itemCount; i++) {
                        this.getItem(i).selected = false;
                    }
                    this.focus();
                } else {
                    if (Tigerian.Class.isInstance(v, "number")) {
                        v = ((v < -1) ? -1 : ((v >= this.itemCount) ? this.itemCount - 1 : v));

                        for (var i = 0; i < this.itemCount; i++) {
                            this.getItem(i).selected = (v === i);
                            if (v === i) {
                                this.getItem(i).focus();
                                this.itemIndex = i;
                            }
                        }
                    } else if (multi && Tigerian.Class.isInstance(v, Array)) {
                        /**
                         * @param {number} n
                         * @param {number} idx
                         * @param {Array} arr
                         * @returns {boolean|*}
                         * @this Tigerian.BSelectGroup
                         */
                        function getValidItems(n, idx, arr) {
                            return (Tigerian.Class.isInstance(n, "number") && (n >= 0) && (n < this.itemCount) && (arr.indexOf(n, idx + 1) === -1));
                        }

                        v = v.sort(function (a, b) {
                            return a >= b;
                        }).filter(getValidItems, this);

                        for (var i = 0; i < this.itemCount; i++) {
                            var select = (v.indexOf(i) >= 0);
                            this.getItem(i).selected = select;

                            if (select) {
                                this.itemIndex = i;
                            }
                        }
                    }
                }
            }
        });

        /**
         * @member {number}
         */
        Object.defineProperty(this, "selectedCount", {
            enumerable: true,
            configurable: true,

            get: function () {
                if (multi) {
                    return this.selectedIndex.length;
                } else {
                    return ((this.selectedIndex === -1) ? 0 : 1);
                }
            }
        });

        /**
         * @member {boolean}
         */
        Object.defineProperty(this, "multiSelect", {
            enumerable: true,
            configurable: true,
            get: function () {
                return multi;
            },
            set: function (v) {
                if (Tigerian.Class.isInstance(v, "boolean")) {
                    multi = v;

                    if (v) {
                        for (var i = 0; i < this.itemCount; i++) {
                            this.getItem(i).autoDeselect = true;
                        }
                    } else {
                        for (var i = 0; i < this.itemCount; i++) {
                            if ((this.selectedCount > 1) && (i !== this.itemIndex)) {
                                this.getItem(i).selected = false;
                            }
                            this.getItem(i).autoDeselect = false;
                        }
                    }
                }
            }
        });
    },
    /**
     * @param {string} behavior
     * @param {Tigerian.Control} ctrlSelectGroup
     */
    config: function (behavior, ctrlSelectGroup) {
        if (behavior === "select_group") {
            if (!(Tigerian.Class.isInstance(ctrlSelectGroup, Tigerian.Control) && ctrlSelectGroup["Behavior:group"] && ctrlSelectGroup["Behavior:select_group"])) {
                ctrlSelectGroup = this;
            } else {
                var itemCount = Object.getOwnPropertyDescriptor(ctrlSelectGroup, "itemCount");
                var multiSelect = Object.getOwnPropertyDescriptor(ctrlSelectGroup, "multiSelect");
                this.addItem = ctrlSelectGroup.addItem.bind(this);
                this.removeItem = ctrlSelectGroup.removeItem.bind(this);
                this.getItem = ctrlSelectGroup.getItem.bind(this);
                this.clear = ctrlSelectGroup.clear.bind(this);
                /**
                 * @member {number}
                 */
                Object.defineProperty(this, "itemCount", {
                    enumerable: true,
                    configurable: true,
                    get: itemCount.get.bind(this),
                    set: itemCount.set.bind(this),
                });
                /**
                 * @member {boolean}
                 */
                Object.defineProperty(this, "multiSelect", {
                    enumerable: true,
                    configurable: true,
                    get: multiSelect.get.bind(this),
                    set: multiSelect.set.bind(this),
                });
            }

            if (Tigerian.Class.isInstance(ctrlSelectGroup, Tigerian.Control) && ctrlSelectGroup["Behavior:group"] && ctrlSelectGroup["Behavior:select_group"]) {
                var instance = this;
                var lastSelectedCount = ctrlSelectGroup.selectedCount;
                var lastItemIndex = ctrlSelectGroup.itemIndex;
                var lastSelectedIndex = ctrlSelectGroup.selectedIndex;

                var initItemIndex = Object.getOwnPropertyDescriptor(ctrlSelectGroup, "itemIndex");
                var initSelectedIndex = Object.getOwnPropertyDescriptor(ctrlSelectGroup, "selectedIndex");

                var superSort = ctrlSelectGroup.sort.bind(this);

                //NOTE Properties
                /**
                 * @member {number}
                 */
                Object.defineProperty(this, "itemIndex", {
                    enumerable: true,
                    configurable: true,
                    get: initItemIndex.get.bind(this),
                    set: function (v) {
                        initItemIndex.set.bind(this)(v);
                        if (initItemIndex.get.bind(this)() !== lastItemIndex) {
                            if (lastItemIndex !== -1) {
                                instance.getItem(lastItemIndex).setAttribute("focused", "false");
                            }
                            if ((v >= 0) && (v < instance.itemCount)) {
                                instance.getItem(v).setAttribute("focused", "true");
                            }
                            instance.dispatchEvent(Tigerian.Event.onItemIndexChange);
                            lastItemIndex = initItemIndex.get.bind(this)();
                        }
                    }
                });

                /**
                 * @member {number|number[]}
                 */
                Object.defineProperty(this, "selectedIndex", {
                    enumerable: true,
                    configurable: true,
                    get: initSelectedIndex.get.bind(this),
                    set: function (v) {
                        initSelectedIndex.set.bind(this)(v);

                        if (!Tigerian.compare(lastSelectedIndex, initSelectedIndex.get.bind(this)())) {
                            this.dispatchEvent(Tigerian.Event.onSelectedIndexChange, {
                                lastSelectedIndex: lastSelectedIndex
                            });
                            lastSelectedIndex = initSelectedIndex.get.bind(this)();
                        }

                        if (this.selectedCount !== lastSelectedCount) {
                            this.dispatchEvent(Tigerian.Event.onSelectedCountChange, {
                                lastSelectedCount: lastSelectedCount
                            });
                            lastSelectedCount = instance.selectedCount;
                        }
                    }
                });

                //NOTE Private Functions
                /**
                 * @param {Event} e
                 */
                function onSelectedChange(e) {
                    for (var i = 0; i < instance.itemCount; i++) {
                        if (this !== instance.getItem(i)) {
                            if (!instance.multiSelect && this.selected && instance.getItem(i).selected) {
                                instance.getItem(i).selected = false;
                            }
                        } else {
                            instance.itemIndex = i;
                        }
                    }

                    // console.log(lastSelectedIndex, instance.selectedIndex, Tigerian.compare(lastSelectedIndex, instance.selectedIndex));

                    if (!Tigerian.compare(lastSelectedIndex, instance.selectedIndex)) {
                        instance.dispatchEvent(Tigerian.Event.onSelectedIndexChange, {
                            lastSelectedIndex: lastSelectedIndex
                        });
                    }

                    if (instance.selectedCount !== lastSelectedCount) {
                        instance.dispatchEvent(Tigerian.Event.onSelectedCountChange, {
                            lastSelectedCount: lastSelectedCount
                        });
                    }

                    lastSelectedCount = instance.selectedCount;
                    lastSelectedIndex = instance.selectedIndex;
                }

                /**
                 * @param {Event} e
                 * @param {Array} params
                 */
                function onAddItem(e) {
                    e.data.addedItem.setAttribute("focused", "false");
                    e.data.addedItem.addEvent("selectedchange", onSelectedChange);
                }


                //NOTE Public Functions
                this.selectAll = function () {
                    if (this.multiSelect) {
                        for (var i = 0; i < this.itemCount; i++) {
                            this.getItem(i).selected = true;
                        }
                    }
                };

                this.selectNone = function () {
                    for (var i = 0; i < this.itemCount; i++) {
                        this.getItem(i).selected = false;
                    }
                };

                /**
                 * @param {Function} func
                 */
                this.sort = function (func) {
                    superSort(func);
                    lastSelectedIndex = this.selectedIndex;
                };

                /**
                 * @param {Event} e
                 */
                function onKeyDown(e) {
                    var itemIndex = Math.min(Math.max(0, instance.itemIndex), instance.itemCount);

                    function setIndex() {
                        if (instance.getItem(itemIndex).enabled) {
                            instance.itemIndex = itemIndex;
                        }

                        if (!instance.multiSelect) {
                            instance.selectedIndex = instance.itemIndex;
                        }
                        e.preventDefault();
                    }

                    if (this.focused) {
                        switch (e.code) {
                            case "ArrowDown":

                                while ((itemIndex < instance.itemCount - 1) && !instance.getItem(++itemIndex).enabled);
                                setIndex();
                                break;

                            case "ArrowUp":
                                while ((itemIndex > 0) && !instance.getItem(--itemIndex).enabled);
                                setIndex();
                                break;

                            case "Space":
                                if (instance.multiSelect) {
                                    if (!instance.getItem(instance.itemIndex).selected || instance.getItem(instance.itemIndex).autoDeselect) {
                                        instance.getItem(instance.itemIndex).selected = !instance.getItem(instance.itemIndex).selected;
                                        if (!Tigerian.compare(lastSelectedIndex, instance.selectedIndex)) {
                                            this.getItem(instance.itemIndex).dispatchEvent(Tigerian.Event.onSelectedChange, {
                                                lastSelectedIndex: lastSelectedIndex
                                            });
                                        }
                                        lastSelectedIndex = instance.selectedIndex;
                                    }
                                    e.preventDefault();
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }

                /**
                 * @param {Event} e
                 */
                function onFocus(e) {
                    if ((instance.itemIndex < 0) || (instance.itemIndex >= instance.itemCount)) {
                        instance.itemIndex = 0;
                    }
                    if (!instance.multiSelect && (instance.itemIndex !== instance.selectedIndex)) {
                        instance.itemIndex = instance.selectedIndex;
                    }

                    if (instance.itemIndex >= 0) {
                        instance.getItem(instance.itemIndex).setAttribute("focused", "true");
                    }
                }


                //NOTE Default Events
                this.addEvent("keydown", onKeyDown);
                this.addEvent("focus", onFocus);
                window.addEventListener("keydown", function (e) {
                    if (this.focuesd) {
                        e.preventDefault();
                    }
                }.bind(this));
                this.addEvent("Add", onAddItem);
            }
        }
    }
});