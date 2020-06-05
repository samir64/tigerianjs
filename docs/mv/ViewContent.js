import { View } from "../../model_view/View.js";
import { Control, EControl } from "../../core/Control.js";
import { Ajax } from "../../core/Ajax.js";
import { Loading } from "../../controls/Loading.js";
import { Container } from "../../controls/Container.js";
import { Label } from "../../controls/Label.js";
import { Button } from "../../controls/Button.js";
import { strFormat } from "../../core/Tigerian.js";
import { EWindow } from "../../behaviors/BWindow.js";
import { Events } from "../../core/Events.js";

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
    let content = new Control(parent, parent.theme, "article");
    super(content);

    // let loaded = false;
    let pages = {};
    let instance = this;
    let ajax = new Ajax();
    // let loading = new Loading(content, parent.theme);
    let ctrContent = new Container(content, parent.theme);
    let txtCaption = new Label(ctrContent, parent.theme);
    let context = new Label(ctrContent, parent.theme);
    let ctrButton = new Control(content, parent.theme);
    let btnPrevTopic = new Button(ctrButton, "Previous", parent.theme);
    let btnNextTopic = new Button(ctrButton, "Next", parent.theme);
    let { prev, next } = {
      vPrev: "",
      vNext: ""
    };

    ctrButton.setAttribute("element-type", "ButtonsContainer");
    // txtCaption.text = "<h1>{}</h1>: <h2>{}</h2>".format(title, subject);

    txtCaption.style.padding = "0 25px";
    txtCaption.style.margin.bottom = "50px";
    txtCaption.column = 12;

    context.column = 12;

    ctrButton.style.margin = "50px 0";
    ctrButton.column = 12;

    btnNextTopic.situation = EControl.DEFAULT;
    btnPrevTopic.situation = EControl.TITLE;

    btnPrevTopic.style.padding = btnNextTopic.style.padding = "10px";

    /* content.largeColumn = 11;
    content.xlargeColumn = 10;
    content.largeColumn = 11;
    content.xlargeColumn = 10; */

    btnPrevTopic.column[EWindow.XSMALL] = btnNextTopic.column[
      EWindow.XSMALL
    ] = 6;
    btnPrevTopic.column[EWindow.SMALL] = btnNextTopic.column[EWindow.SMALL] = 5;
    // btnPrevTopic.column[EWindow.MEDIUM] = btnNextTopic.column[
    //   EWindow.MEDIUM
    // ] = 5;

    btnPrevTopic.style.float = "left";
    btnNextTopic.style.float = "right";

    content.style.text.align = "justify";

    // context.style.overflow.x = "auto";

    /* btnPrevTopic.smallColumn = btnNextTopic.smallColumn = 6;
    btnPrevTopic.mediumColumn = btnNextTopic.mediumColumn = 5;
    btnPrevTopic.normalColumn = btnNextTopic.normalColumn = 4; */

    /* btnPrevTopic.float = EControl.LEFT;
    btnNextTopic.float = EControl.RIGHT; */

    // content.float = EControl.CENTER;

    txtCaption.situation = EControl.TITLE;

    btnPrevTopic.addEvent("click", e => {
      // route.redirect(contentTable.getPrevious());
      route.redirect(prev);
    });

    btnNextTopic.addEvent("click", e => {
      // route.redirect(contentTable.getNext());
      route.redirect(next);
    });

    /**
     * @param {object} params
     * @param {string} uriString
     */
    this.addEvent(
      Events.onRefresh,
      ({
        data: {
          params: { previousPage, nextPage, root, page, uriString },
          path,
          parts
        }
      }) => {
        //
        // { previousPage, nextPage, root, page }, uriString) {
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
          ajax
            .sendGet()
            .then(text => {
              pages[uriString] = context.text = text;
            })
            .reject(() => {
              instance.hide();
              route.pageNotFound.show();
            })
            .finally(() => {
              loading.close();
            });
        }

        // if (!loaded) {
        // loading.showModal();
        // ajax.success = (text) => {
        //     context.text = text;
        //     // loaded = true;
        //     loading.close();
        // };
        // ajax.get();
        // }
      }
    );
  }
}
