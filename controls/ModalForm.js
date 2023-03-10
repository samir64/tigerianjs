import {
  Control
} from "../core/Control.js";
import {
  Header
} from "./Header.js";
import {
  Footer
} from "./Footer.js";
import {
  BModal
} from "../behaviors/BModal.js";
import {
  BCancel
} from "../behaviors/BCancel.js";

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

   */
  constructor(parent) {
    super(parent);

    let ctrlHeader = new Header(null, true, this.theme);
    let ctrlBody = new Control(null, this.theme);
    let ctrlFooter = new Footer(null, false, this.theme);

    this.config(BModal, parent);
    this.config(BCancel, this, ctrlHeader);

    this.addControl(ctrlHeader);
    this.addControl(ctrlBody);
    this.addControl(ctrlFooter);

    // this.setAttribute("element-type", "ModalForm");
    this.dataset.elementName = "container";

    // ctrlBody.setAttribute("element-type", "ModalForm");
    ctrlBody.dataset.elementName = "body";

    this.addControl = ctrlBody.addControl.bind(this);
    this.footerAddControl = ctrlFooter.addControl.bind(this);
    this.headerAddControl = ctrlHeader.addControl.bind(this);
  }
}