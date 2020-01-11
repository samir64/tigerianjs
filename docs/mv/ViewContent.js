import {
  View
} from "../../model_view/View.js";
import {
  Control,
  EControl
} from "../../core/Control.js";
import {
  Ajax
} from "../../core/Ajax.js";
import {
  Loading
} from "../../controls/Loading.js";
import {
  Container
} from "../../controls/Container.js";
import {
  Label
} from "../../controls/Label.js";
import {
  Button
} from "../../controls/Button.js";
import {
  strFormat
} from "../../core/Tigerian.js";
import {
  EWindow
} from "../../behaviors/BWindow.js";

("use strict");

/**
 * @constructor
 * @extends {View}
 */
export class ViewContent extends View {
  /**
   * @constructs
   * @param {UI} parent
   * @param {ViewContentTable} contentTable
   * @param {string} prev
   * @param {string} next
   * @param {Route} route
   */
  constructor(parent, loading, route) {
    var content = new Control(parent, parent.theme, "article");
    super(content);

    // var loaded = false;
    var pages = {};
    var instance = this;
    var ajax = new Ajax();
    // var loading = new Loading(content, parent.theme);
    var ctrContent = new Container(content, parent.theme);
    var txtCaption = new Label(ctrContent, parent.theme);
    var context = new Label(ctrContent, parent.theme);
    var ctrButton = new Control(content, parent.theme);
    var btnPrevTopic = new Button(ctrButton, "Previous", parent.theme);
    var btnNextTopic = new Button(ctrButton, "Next", parent.theme);
    var {
      prev,
      next
    } = {
      vPrev: "",
      vNext: ""
    };

    ctrButton.setAttribute("element-type", "ButtonsContainer");
    // txtCaption.text = "<h1>{}</h1>: <h2>{}</h2>".format(title, subject);

    txtCaption.style.padding = "0 25px";
    txtCaption.style.margin.bottom = "50px";

    ctrButton.style.margin = "50px 0";

    btnNextTopic.situation = EControl.DEFAULT;
    btnPrevTopic.situation = EControl.TITLE;

    btnPrevTopic.style.padding = btnNextTopic.style.padding = "15px";

    /* content.largeColumn = 11;
    content.xlargeColumn = 10;
    content.largeColumn = 11;
    content.xlargeColumn = 10; */

    btnPrevTopic.column[EWindow.XSMALL] = btnNextTopic.column[EWindow.XSMALL] = 6;
    btnPrevTopic.column[EWindow.SMALL] = btnNextTopic.column[EWindow.SMALL] = 5;
    btnPrevTopic.column[EWindow.MEDIUM] = btnNextTopic.column[EWindow.MEDIUM] = 5;

    btnPrevTopic.style.float = "left";
    btnNextTopic.style.float = "right";

    content.style.text.align = "justify";

    /* btnPrevTopic.smallColumn = btnNextTopic.smallColumn = 6;
    btnPrevTopic.mediumColumn = btnNextTopic.mediumColumn = 5;
    btnPrevTopic.normalColumn = btnNextTopic.normalColumn = 4; */

    /* btnPrevTopic.float = EControl.LEFT;
    btnNextTopic.float = EControl.RIGHT; */

    // content.float = EControl.CENTER;

    txtCaption.situation = EControl.TITLE;

    btnPrevTopic.addEvent("click", function (e) {
      // route.redirect(contentTable.getPrevious());
      route.redirect(prev);
    });

    btnNextTopic.addEvent("click", function (e) {
      // route.redirect(contentTable.getNext());
      route.redirect(next);
    });

    /**
     * @param {object} params 
     * @param {string} uriString 
     */
    this.refresh = function ({
      previousPage,
      nextPage,
      root,
      page
    }, uriString) {
      // contentTable.refresh(params);

      // txtCaption.text = strFormat("<h1>{}</h1>: <h2>{}</h2>", contentTable.getTitle("root"), contentTable.getTitle("page"));
      txtCaption.text = strFormat("<h2>{}</h2>: <h1>{}</h1>", root, page);

      prev = previousPage;
      next = nextPage;

      if (uriString === "") {
        uriString = "intro/story";
      }

      // uriString = strFormat(uriString, params);

      if (uriString in pages) {
        context.text = pages[uriString];
      } else {
        loading.showModal();
        ajax.url = "./contents/" + uriString + ".html";
        ajax.success = function (text) {
          pages[uriString] = context.text = text;
          loading.close();
        };
        ajax.unsuccess = function () {
          instance.hide();
          route.pageNotFound.show();
          // route.redirect("#/wrong-page");
          loading.close();
        };
        ajax.get();
      }

      // if (!loaded) {
      // loading.showModal();
      // ajax.success = function (text) {
      //     context.text = text;
      //     // loaded = true;
      //     loading.close();
      // };
      // ajax.get();
      // }
    };
  }
}