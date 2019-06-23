/**
 * Created by samir on 11/10/16.
 */

("use strict");


/**
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BGroup}
 * @implements {Tigerian.BSelectGroup}
 * @constructor
 */
Tigerian.ListBox = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("group");
        this.config("select_group");

        //NOTE Private Variables
        var instance = this;

        //NOTE Alias Super Members
        var superAddControl = this.addControl.bind(this);
        var bGroupSort = this.sort.bind(this);

        //NOTE Attributes
        this.setAttribute("element-type", "ListBox");
        this.setAttribute("element-name", "container");

        //NOTE Public Functions
        /**
         * @param {Tigerian.ListItem|string} item
         */
        this.addControl = this.addItem = function (item) {
            if (Tigerian.Class.isInstance(item, "string")) {
                item = new Tigerian.ListItem(null, item, this.theme);
            } else if (!(Tigerian.Class.isInstance(item, Tigerian.Control) && item["Behavior:select"])) {
                item = new Tigerian.ListItem(null, "Item " + (this.itemCount + 1).toString(), this.theme);
            }

            item.autoDeselect = this.multiSelect;
            superAddControl(item);
        };

        /**
         * @param {boolean} accending = true
         */
        this.sort = function (ascending) {
            /**
             * @param {Tigerian.ListItem} a 
             * @param {Tigerian.ListItem} b 
             */
            function sort(a, b) {
                return ((ascending === false) ? b.text.padNumbers(20, 20) >= a.text.padNumbers(20, 20) : a.text.padNumbers(20, 20) >= b.text.padNumbers(20, 20));
            }

            bGroupSort(sort);
        };
    }
}, Tigerian.BGroup, Tigerian.BSelectGroup);