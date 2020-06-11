import {
    Control
} from "../core/Control.js";
import {
    BFixElement,
    EFixElement
} from "../behaviors/BFixElement.js";

/**
 * Created by samir on 09/20/18.
 */

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BFixElement}
 */
export class Header extends Control {
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    constructor(parent, fixed = true, theme = "") {
        super(parent, theme, "header");
        this.config(BFixElement, EFixElement.TOP, this);

        this.fixed = fixed;

        // this.setAttribute("element-type", "Header");
        this.setAttribute("element-name", "container");
    }
}