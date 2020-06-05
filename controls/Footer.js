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
export class Footer extends Control {
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    constructor(parent, fixed = true, theme = "") {
        super(parent, theme, "footer");
        this.config(BFixElement, EFixElement.BOTTOM, this);

        this.fixed = fixed;

        this.setAttribute("element-type", "Footer");
        this.setAttribute("element-name", "container");
    }
}