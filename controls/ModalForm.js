("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BModal}
 * @implements {BCancel}
 */
ModalForm = Control.extend({
    /**
     * @constructs
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function (parent, theme) {
        this.super(parent, theme);

        var ctrlHeader = new Header(null, true, this.theme);
        var ctrlBody = new Control(null, this.theme);
        var ctrlFooter = new Footer(null, false, this.theme);

        this.config("modal", parent);
        this.config("cancel", this, ctrlHeader);

        this.addControl(ctrlHeader);
        this.addControl(ctrlBody);
        this.addControl(ctrlFooter);

        this.setAttribute("element-type", "ModalForm");
        this.setAttribute("element-name", "container");

        ctrlBody.setAttribute("element-type", "ModalForm");
        ctrlBody.setAttribute("element-name", "body");

        this.addControl = ctrlBody.addControl.bind(this);
        this.footerAddControl = ctrlFooter.addControl.bind(this);
        this.headerAddControl = ctrlHeader.addControl.bind(this);
    },
}, BModal, BCancel);