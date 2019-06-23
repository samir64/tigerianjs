/**
 * Created by samir on 8/27/18.
 */


("use strict");


/**
 * @extends {Tigerian.Class}
 * @constructor
 */
Tigerian.ModelView = Tigerian.Class.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super();
        this.config("event");
    },
}, Tigerian.BBind, Tigerian.BEvent);