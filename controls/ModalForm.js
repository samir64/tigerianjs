"use strict";

Tigerian.ModalForm = Tigerian.Control.extend({
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("modal", parent);

        var ctrlHeader = new Tigerian.Header(this, this.theme);
        var ctrlBody = new Tigerian.Control(this, this.theme);
        var ctrlFooter = new Tigerian.Footer(this, this.theme);

        this.addControl = ctrlBody.addControl.bind(this);
        this.footerAddControl = ctrlFooter.addControl.bind(this);
        this.headerAddControl = ctrlHeader.addControl.bind(this);

        this.setAttribute("element-type", "ModalForm");
        this.setAttribute("element-name", "container");
    },
}, Tigerian.BModal);