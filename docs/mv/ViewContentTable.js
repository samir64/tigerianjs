("use strict");

import {
  View
} from "../../model_view/View.js";
import {
  Control,
  EControl
} from "../../core/Control.js";
import {
  Loading
} from "../../controls/Loading.js";
import {
  CollapseList
} from "../../controls/CollapseList.js";
import {
  ModelTopic
} from "./ModelTopic.js";
import {
  instanceOf,
  forEach
} from "../../core/Tigerian.js";
import {
  CollapseItem
} from "../../controls/CollapseItem.js";

/**
 * @constructor
 * @extends {View}
 */
export class ViewContentTable extends View {
  /**
   * @constructs
   * @param {UI} parent
   * @param {Route} route
   */
  constructor(parent, content, loading, route) {
    let container = new Control(parent, parent.theme, "nav");
    super(container);

    let lastPage = "";
    let currentPage = "";
    let fetchedList = false;
    let model = new ModelTopic(route.applicationRoot);
    let items = [];
    // let loading = new Loading(container, parent.theme);
    let lstTitles = new CollapseList(container, parent.theme);

    let that = this;

    // let itmIntro = new CollapseItem(lstTitles, "Introduction", parent.theme);
    // let itmIntro_story = new CollapseItem(itmIntro, "Tigerian.js story", parent.theme);
    // let itmIntro_what = new CollapseItem(itmIntro, "What is Tigerian.js?", parent.theme);
    // let itmIntro_why = new CollapseItem(itmIntro, "Why use Tigerian.js?", parent.theme);
    // let itmIntro_how = new CollapseItem(itmIntro, "How to use Tigerian.js?", parent.theme);

    // let itmManual = new CollapseItem(lstTitles, "Manual", parent.theme);
    // let itmManual_structure = new CollapseItem(itmManual, "Tigerian.js structure", parent.theme);
    // let itmManual_structure_intro = new CollapseItem(itmManual_structure, "How Tigerian.js works", parent.theme);
    // let itmManual_structure_class = new CollapseItem(itmManual_structure, "Class", parent.theme);
    // let itmManual_structure_behavior = new CollapseItem(itmManual_structure, "Behavior", parent.theme);
    // let itmManual_structure_string = new CollapseItem(itmManual_structure, "String Additional Functions", parent.theme);

    // let itmManual_behaviors = new CollapseItem(itmManual, "Tigerian's behaviors", parent.theme);
    // let itmManual_behaviors_bind = new CollapseItem(itmManual_behaviors, "BBind", parent.theme);
    // let itmManual_behaviors_event = new CollapseItem(itmManual_behaviors, "BEvent", parent.theme);
    // let itmManual_behaviors_window = new CollapseItem(itmManual_behaviors, "BWindow", parent.theme);
    // let itmManual_behaviors_style = new CollapseItem(itmManual_behaviors, "BStyle", parent.theme);
    // let itmManual_behaviors_label = new CollapseItem(itmManual_behaviors, "BLabel", parent.theme);
    // let itmManual_behaviors_text = new CollapseItem(itmManual_behaviors, "BText", parent.theme);
    // let itmManual_behaviors_cancel = new CollapseItem(itmManual_behaviors, "BCancel", parent.theme);
    // let itmManual_behaviors_fix = new CollapseItem(itmManual_behaviors, "BFixElement", parent.theme);
    // let itmManual_behaviors_model = new CollapseItem(itmManual_behaviors, "BModal", parent.theme);
    // let itmManual_behaviors_page = new CollapseItem(itmManual_behaviors, "BPagination", parent.theme);
    // let itmManual_behaviors_table = new CollapseItem(itmManual_behaviors, "BTable", parent.theme);
    // let itmManual_behaviors_select = new CollapseItem(itmManual_behaviors, "BSelect", parent.theme);
    // let itmManual_behaviors_group = new CollapseItem(itmManual_behaviors, "BGroup", parent.theme);
    // let itmManual_behaviors_selectGroup = new CollapseItem(itmManual_behaviors, "BSelectGroup", parent.theme);
    // let itmManual_behaviors_cascade = new CollapseItem(itmManual_behaviors, "BCascade", parent.theme);
    // let itmManual_behaviors_filter = new CollapseItem(itmManual_behaviors, "BFilter", parent.theme);

    // let itmManual_classes = new CollapseItem(itmManual, "Tigerian's classes", parent.theme);
    // let itmManual_classes_tigerian = new CollapseItem(itmManual_classes, "Tigerian", parent.theme);
    // let itmManual_classes_iterator = new CollapseItem(itmManual_classes, "Iterator", parent.theme);
    // let itmManual_classes_ajax = new CollapseItem(itmManual_classes, "Ajax", parent.theme);

    // let itmManual_classes_ui = new CollapseItem(itmManual_classes, "UI Classes", parent.theme);
    // let itmManual_classes_ui_ui = new CollapseItem(itmManual_classes_ui, "UI", parent.theme);
    // let itmManual_classes__ui_application = new CollapseItem(itmManual_classes_ui, "Application", parent.theme);
    // let itmManual_classes_ui_control = new CollapseItem(itmManual_classes_ui, "Control", parent.theme);
    // let itmManual_classes_ui_container = new CollapseItem(itmManual_classes_ui, "Container", parent.theme);
    // let itmManual_classes_ui_loading = new CollapseItem(itmManual_classes_ui, "Loading", parent.theme);
    // let itmManual_classes_ui_header = new CollapseItem(itmManual_classes_ui, "Header", parent.theme);
    // let itmManual_classes_ui_footer = new CollapseItem(itmManual_classes_ui, "Footer", parent.theme);
    // let itmManual_classes_ui_spacer = new CollapseItem(itmManual_classes_ui, "Spacer", parent.theme);
    // let itmManual_classes_ui_button = new CollapseItem(itmManual_classes_ui, "Button", parent.theme);
    // let itmManual_classes_ui_label = new CollapseItem(itmManual_classes_ui, "Label", parent.theme);
    // let itmManual_classes_ui_link = new CollapseItem(itmManual_classes_ui, "HyperLink", parent.theme);
    // let itmManual_classes_ui_textbox = new CollapseItem(itmManual_classes_ui, "TextBox", parent.theme);
    // let itmManual_classes_ui_field = new CollapseItem(itmManual_classes_ui, "Field", parent.theme);
    // let itmManual_classes_ui_checkbox = new CollapseItem(itmManual_classes_ui, "CheckBox", parent.theme);
    // let itmManual_classes_ui_radiobutton = new CollapseItem(itmManual_classes_ui, "RadioButton", parent.theme);
    // let itmManual_classes_ui_notification = new CollapseItem(itmManual_classes_ui, "Notification", parent.theme);
    // let itmManual_classes_ui_form = new CollapseItem(itmManual_classes_ui, "ModalForm", parent.theme);

    // let itmManual_classes_ui_table = new CollapseItem(itmManual_classes_ui, "Table classes", parent.theme);
    // let itmManual_classes_ui_table_table = new CollapseItem(itmManual_classes_ui_table, "Table", parent.theme);
    // let itmManual_classes_ui_table_body = new CollapseItem(itmManual_classes_ui_table, "TableBody", parent.theme);
    // let itmManual_classes_ui_table_row = new CollapseItem(itmManual_classes_ui_table, "TableRow", parent.theme);
    // let itmManual_classes_ui_table_cell = new CollapseItem(itmManual_classes_ui_table, "TableCell", parent.theme);

    // let itmManual_classes_ui_list = new CollapseItem(itmManual_classes_ui, "List classes", parent.theme);
    // let itmManual_classes_ui_list_list = new CollapseItem(itmManual_classes_ui_list, "ListBox", parent.theme);
    // let itmManual_classes_ui_list_item = new CollapseItem(itmManual_classes_ui_list, "ListItem", parent.theme);
    // let itmManual_classes_ui_list_filter = new CollapseItem(itmManual_classes_ui_list, "FilterList", parent.theme);
    // let itmManual_classes_ui_list_combo = new CollapseItem(itmManual_classes_ui_list, "ComboBox", parent.theme);

    // let itmManual_classes_ui_list_collapse = new CollapseItem(itmManual_classes_ui_list, "Collapse List classes", parent.theme);
    // let itmManual_classes_ui_list_collapse_collapse = new CollapseItem(itmManual_classes_ui_list_collapse, "CollapseList", parent.theme);
    // let itmManual_classes_ui_list_collapse_item = new CollapseItem(itmManual_classes_ui_list_collapse, "CollapseItem", parent.theme);

    // let itmManual_classes_ui_menu = new CollapseItem(itmManual_classes_ui, "Menu classes", parent.theme);
    // let itmManual_classes_ui_menu_mainmenu = new CollapseItem(itmManual_classes_ui_menu, "MainMenu", parent.theme);
    // let itmManual_classes_ui_menu_menu = new CollapseItem(itmManual_classes_ui_menu, "Menu", parent.theme);
    // let itmManual_classes_ui_menu_item = new CollapseItem(itmManual_classes_ui_menu, "MenuItem", parent.theme);

    // let itmManual_classes_modelView = new CollapseItem(itmManual_classes, "Model View Classes", parent.theme);
    // let itmManual_classes_modelView_model = new CollapseItem(itmManual_classes_modelView, "Model", parent.theme);
    // let itmManual_classes_modelView_modelField = new CollapseItem(itmManual_classes_modelView, "ModelField", parent.theme);
    // let itmManual_classes_modelView_view = new CollapseItem(itmManual_classes_modelView, "View", parent.theme);

    // let itmManual_classes_route = new CollapseItem(itmManual_classes, "Route", parent.theme);

    // let itmTutorials = new CollapseItem(lstTitles, "Tutorials", parent.theme);

    // itmIntro_story.addEvent("click", (e) => {
    //     route.redirect("#/intro/story");
    // });

    // itmIntro_what.addEvent("click", (e) => {
    //     route.redirect("#/intro/what");
    // });

    // itmIntro_why.addEvent("click", (e) => {
    //     route.redirect("#/intro/why");
    // });

    let selectItem = (page, select) => {
      if (page !== undefined) {
        items[page].item.situation = (select ? EControl.TITLE : EControl.NONE);
        if (select) {
          let pnt = items[page].item;
          while ((pnt = pnt.parent) !== lstTitles) {
            if (instanceOf(pnt, CollapseItem)) {
              pnt.viewChild(true);
            }
          }
        }
      }
      // switch (page) {
      //     case ViewContentTable.EStory:
      //         itmIntro.viewChild(true);
      //         itmIntro_story.situation = (select ? Tigerian.Control.ETitle : Tigerian.Control.ENormal);
      //         break;

      //     case ViewContentTable.EWhat:
      //         itmIntro.viewChild(true);
      //         itmIntro_what.situation = (select ? Tigerian.Control.ETitle : Tigerian.Control.ENormal);
      //         break;

      //     case ViewContentTable.EWhy:
      //         itmIntro.viewChild(true);
      //         itmIntro_why.situation = (select ? Tigerian.Control.ETitle : Tigerian.Control.ENormal);
      //         break;

      //     default:
      //         break;
      // }
    };

    let autoExpand = (path) => {
      lstTitles.collapseAll();

      if (items[currentPage.root] && items[currentPage.page]) {

        selectItem(lastPage.page, false);
        selectItem(currentPage.page, true);

        content.refresh({
          previousPage: that.getPrevious(),
          nextPage: that.getNext(),
          root: that.getTitle("root"),
          page: that.getTitle("page")
        }, path);

        content.show();
        lastPage = currentPage;
      } else {
        route.pageNotFound.show();
        content.hide();
      }
    };

    let addItem = (parent, itemModel, prev, uri) => {
      uri += "/" + itemModel.name;
      let item = new CollapseItem(parent, itemModel.title, parent.theme);

      items[itemModel.name] = {
        model: itemModel,
        item
      };

      if (itemModel.children) {
        for (let i = 0; i < itemModel.children.length; i++) {
          prev = addItem(item, itemModel.children[i], prev, uri);
        }
      } else {
        item.addEvent("click", (e) => {
          route.redirect(uri);
        });
        items[itemModel.name].uri = uri;
        items[itemModel.name].prev = prev;
        if (prev !== "") {
          items[prev].next = itemModel.name;
        }
        return itemModel.name;
      }

      return prev;
    };

    let fetchList = (path) => {
      return (models) => {
        let prev = "story";

        console.time("elements");

        forEach(models, (model, index) => {
          /* if (prev === undefined) {
            prev = model.name;
          } */

          prev = addItem(lstTitles, model, prev, "");
        });

        console.timeEnd("elements");

        fetchedList = true;
        loading.close();

        autoExpand(path);
      }
    };

    this.getTitle = (index) => {
      switch (index) {
        case "root":
          if ("root" in currentPage) {
            return items[currentPage.root].model.title;
          }
          break;

        case "page":
          if ("page" in currentPage) {
            return items[currentPage.page].model.title;
          }

          default:
      }
    };

    this.getPrevious = function () {
      return items[items[currentPage.page].prev].uri;
    };

    this.getNext = function () {
      return items[items[currentPage.page].next].uri;
    };

    this.refresh = (params, path) => {
      if (instanceOf(params, "object") && ("page" in params)) {
        currentPage = params;
      } else {
        currentPage = {
          root: "intro",
          page: "story",
        };
      }

      if (!fetchedList) {
        loading.showModal();
        model.search({}, fetchList(path), (response) => {
          loading.close();
          console.error(response);
        });
      } else {
        autoExpand(path);
      }
    };
  }
}