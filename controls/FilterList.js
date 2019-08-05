/**
 * Created by samir on 11/10/16.
 */

("use strict");


/**
 * @extends {ListBox}
 * @implements {BFilter}
 * @constructor
 */
export class FilterList extends ListBox {
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    constructor(parent, theme = "") {
        super(parent, theme);

        var ctrlFilter = new TextBox(null, "", this.theme);
        this.config(BFilter, ctrlFilter);

        this.addGeneralControl(ctrlFilter);

        this.filtering = true;

        this.setAttribute("element-type", "FilterList");
        this.setAttribute("element-name", "container");
    }
}