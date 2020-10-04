"use strict";

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
import { responsive } from "../core/Responsive.js";

// let root = "Tigerian.js/docs";
let root = window.location.pathname;

responsive();

let app = new Application("Tigerian.js Developer Guide");
let route = new Route(root, true);

let viewMain = new ViewMain(app);
let viewContent = new ViewContent(viewMain.getContent(), viewMain.getLoading(), route);
let viewContentTable = new ViewContentTable(viewMain.getSideBar(), viewContent, viewMain.getLoading(), route);
let viewPageNotFound = new ViewPageNotFound(viewMain.getContent());

// viewContentTable.refresh();
viewContent.hide();
// viewPageNotFound.hide();

route.pageNotFound = viewPageNotFound;
route.add(viewContentTable, "", "{root}/{page}", "{root}/{sub1}/{page}", "{root}/{sub1}/{sub2}/{page}", "{root}/{sub1}/{sub2}/{sub3}/{page}", "{root}/{sub1}/{sub2}/{sub3}/{sub4}/{page}");
// route.add("#/wrong-page", viewPageNotFound);

route.render();