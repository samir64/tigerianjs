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

/**
 * @constructor
 * @extends {Control}
 * @implements {BFixElement}
 */
export class Footer extends Control {
    /**
     * @constructs
     * @param {UI} parent

     */
    constructor(parent, fixed = true) {
        super(parent, "footer");
        this.config(BFixElement, EFixElement.BOTTOM, this);

        this.fixed = fixed;

        // this.setAttribute("element-type", "Footer");
        this.dataset.elementName = "container";
    }
}