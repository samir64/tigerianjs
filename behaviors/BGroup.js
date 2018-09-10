/**
 * Created by samir on 9/14/16.
 */

'use strict';


/**
 * @implements Tigerian.Behavior
 * @extends Tigerian.Control
 * @interface
 */
Tigerian.BGroup = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        if (Tigerian.Class.isInstance(this, Tigerian.Control)) {
            this.super("group");

            //TODO Alias Super Members
            var superAddControl = this.addControl.bind(this);


            //TODO Private Members
            /**
             * @type {Tigerian.Control[]}
             */
            var items = [];


            //TODO Properties
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

            //TODO Public Functions
            /**
             * @param {Tigerian.Control} item
             */
            this.addItem = function (item) {
                if (Tigerian.Class.isInstance(item, Tigerian.Control)) {
                    items.push(item);
                    superAddControl(item);

                    this.dispatchEvent(Tigerian.Event.onItemAdded, [item]);
                } else {
                    throw new TypeError("Item type doesn't match to Generic Type");
                }
            };

            /**
             * @param {number} itemIndex
             * @returns {Tigerian.Control}
             */
            this.getItem = function (itemIndex) {
                if ((Tigerian.Class.isInstance(itemIndex, "number")) && (itemIndex >= 0) && (itemIndex <= items.length)) {
                    return items[itemIndex];
                }
            };

            /**
             * @param {number} itemIndex
             */
            this.removeItem = function (itemIndex) {
                if ((Tigerian.Class.isInstance(itemIndex, "number")) && (itemIndex >= 0) && (itemIndex <= items.length)) {
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


            //TODO Override Members
            this.addControl = this.addItem;
        }
    }
});
