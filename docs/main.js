("use strict");

import {
  Application
} from "../core/Application.js";
import {
  Route
} from "../core/Route.js";
import {
  ViewMain
} from "./mv/ViewMain.js";
import {
  ViewContentTable
} from "./mv/ViewContentTable.js";
import {
  ViewContent
} from "./mv/ViewContent.js";
import {
  ViewPageNotFound
} from "./mv/ViewPageNotFound.js";
import {
  Label
} from "../controls/Label.js";
import {
  ELabel
} from "../behaviors/BLabel.js";

var app = new Application("Tigerian.js Developer Guide");
var route = new Route("/tigerianjs-docs", true);

var viewMain = new ViewMain(app);
var viewContent = new ViewContent(viewMain.getContent(), viewMain.getLoading(), route);
var viewContentTable = new ViewContentTable(viewMain.getSideBar(), viewContent, viewMain.getLoading(), route);
var viewPageNotFound = new ViewPageNotFound(viewMain.getContent());

// viewContentTable.refresh();
viewContent.hide();
// viewPageNotFound.hide();

route.pageNotFound = viewPageNotFound;
route.add(viewContentTable, "", "{root}/{page}", "{root}/{sub1}/{page}", "{root}/{sub1}/{sub2}/{page}", "{root}/{sub1}/{sub2}/{sub3}/{page}", "{root}/{sub1}/{sub2}/{sub3}/{sub4}/{page}");
// route.add("#/wrong-page", viewPageNotFound);

route.render();