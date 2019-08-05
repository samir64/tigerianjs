("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BModal}
 * @implements {BCancel}
 */
export class ModalForm extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} theme = ""
   */
  constructor(parent, theme = "") {
    super(parent, theme);

    var ctrlHeader = new Header(null, true, this.theme);
    var ctrlBody = new Control(null, this.theme);
    var ctrlFooter = new Footer(null, false, this.theme);

    this.config(BModal, parent);
    this.config(BCancel, this, ctrlHeader);

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
  }
}