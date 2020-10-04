import {
    BFilter
} from "../behaviors/BFilter.js";
import {
    TextBox
} from "./TextBox.js";
import {
    ListBox
} from "./ListBox.js";

/**
 * Created by samir on 11/10/16.
 */

"use strict";


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

        let ctrlFilter = new TextBox(null, "", this.theme);
        this.config(BFilter, ctrlFilter);

        this.addGeneralControl(ctrlFilter);

        this.filtering = true;

        // this.setAttribute("element-type", "FilterList");
        this.dataset.elementName = "container";
    }
}