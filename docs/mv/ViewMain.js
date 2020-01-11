import {
  View
} from "../../model_view/View.js";
import {
  Header
} from "../../controls/Header.js";
import {
  Control,
  EControl
} from "../../core/Control.js";
import {
  Container
} from "../../controls/Container.js";
import {
  Footer
} from "../../controls/Footer.js";
import {
  Label
} from "../../controls/Label.js";
import {
  HyperLink
} from "../../controls/HyperLink.js";
import {
  EWindow
} from "../../behaviors/BWindow.js";
import {
  Loading
} from "../../controls/Loading.js";

("use strict");

/**
 * @constructor
 * @extends {View}
 */
export class ViewMain extends View {
  /**
   * @constructs
   * @param {UI} parent
   */
  constructor(parent) {
    super(parent);

    var header = new Header(parent, false, parent.theme);
    var ctrBody = new Container(parent, parent.theme);
    var loading = new Loading(ctrBody, parent.theme);
    var ctrSideBar = new Control(ctrBody, parent.theme, "aside");
    var ctrContent = new Control(ctrBody, parent.theme, "section");
    // var content = new Container(ctrContent, parent.theme);
    // var txtTitle = new Label(content, parent.theme);
    // var txtSubject = new Label(content, parent.theme);
    // var ctrButton = new Control(ctrContent, parent.theme);
    // var btnPrevTopic = new Button(ctrButton, "Previous", parent.theme);
    // var btnNextTopic = new Button(ctrButton, "Next", parent.theme);
    var footer = new Footer(parent, false, parent.theme);
    var lblCopyright = new Label(footer, "Powered by", parent.theme);
    var lnkCopyright = new HyperLink(footer, "Tigerian.js", "https://github.com/samir64/Tigerian.js", parent.theme);

    // ctrButton.setAttribute("element-type", "ButtonsContainer");

    // btnNextTopic.situation = Control.EDefault;
    // btnPrevTopic.situation = Control.ETitle;

    ctrContent.column[EWindow.LARGE] = 8;
    ctrContent.column[EWindow.XSMALL] = 12;
    ctrContent.column[EWindow.MEDIUM] = 7;
    ctrContent.column[EWindow.XLARGE] = EWindow.LARGE;
    ctrContent.column[EWindow.SMALL] = EWindow.XSMALL;

    ctrSideBar.column[EWindow.LARGE] = 4;
    ctrSideBar.column[EWindow.MEDIUM] = 5;
    ctrSideBar.column[EWindow.XLARGE] = EWindow.LARGE;

    ctrSideBar.style.display[EWindow.XSMALL] = "none";
    ctrSideBar.style.display[EWindow.MEDIUM] = "inline-block";

    lblCopyright.column = lnkCopyright.column = 6;

    /* ctrlBody.mediumColumn = 5;
    ctrlBody.normalColumn = 4;

    ctrContent.smallColumn = 12;
    ctrContent.mediumColumn = 7;
    ctrContent.normalColumn = 8; */

    /* lblCopyright.normalColumn = 6;
    lnkCopyright.normalColumn = 6; */

    lblCopyright.style.padding.right = lnkCopyright.style.padding.left = "2.5px";
    lblCopyright.style.text.align = "right";


    ctrContent.style.padding[EWindow.XSMALL] = "0 20px";
    ctrContent.style.padding[EWindow.SMALL] = "auto";

    // content.largeColumn = 11;
    // content.xlargeColumn = 10;
    // ctrButton.largeColumn = content.largeColumn = 11;
    // ctrButton.xlargeColumn = content.xlargeColumn = 10;

    // btnPrevTopic.smallColumn = btnNextTopic.smallColumn = 6;
    // btnPrevTopic.mediumColumn = btnNextTopic.mediumColumn = 5;
    // btnPrevTopic.normalColumn = btnNextTopic.normalColumn = 4;

    // btnPrevTopic.float = Control.ELeft;
    // btnNextTopic.float = Control.ERight;
    ctrSideBar.style.float = "left";
    ctrContent.style.float = "right";
    // content.float = Control.ECenter;
    // ctrButton.float = Control.ECenter;

    /* ctrBody.style.display[EWindow.XSMALL] = "none";
    ctrBody.style.display[EWindow.SMALL] = "block"; */

    this.getSideBar = () => {
      return ctrSideBar;
    };

    this.getContent = () => {
      return ctrContent;
      // return content;
    };

    this.getLoading = () => {
      return loading;
    }
  }
}