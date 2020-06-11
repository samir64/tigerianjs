/**
 * Created by samir on 06/06/20.
 */

import {
    Tigerian,
    abstract
} from "./Tigerian";

("use strict");

/**
 * @extends Tigerian
 */
export class Theme extends Tigerian {
    /**
     * @param {String} name
     * @param {Object} type
     */
    constructor(name) {
        super();
        abstract(this, Theme);
    }
}