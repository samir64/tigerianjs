/**
 * Created by samir on 8/27/18.
 */


("use strict");


/**
 * @extends {Class}
 * @constructor
 */
ModelView = Class.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super();
        this.config("event");
    },
}, BBind, BEvent);