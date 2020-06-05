import {
  instanceOf
} from "./Tigerian.js";
import {
  UI
} from "./UI.js";
import {
  BWindow
} from "../behaviors/BWindow.js";
import {
  BGridTemplate
} from "../behaviors/BGridTemplate.js";

/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */

("use strict");

/**
 * @constructor
 * @extends {UI}
 */
export class Application extends UI {
  /**
   * @constructs
   * @param {Element} [element = document.body]
   * @param {string} [title = ""]
   * @param {string} [theme = ""]
   */
  constructor(title = "", element = document.body, theme = "") {
    // let fragment = document.createDocumentFragment();
    super(element, null, theme);

    this.config(BWindow);

    /**
     * @type {BGridTemplate[]}
     */
    let templates = [];
    if (instanceOf(title, String)) {
      document.head.getElementsByTagName("title")[0].innerText = title;
    }

    //NOTE Attributes
    this.setAttribute("element-type", "Application");
    this.setAttribute("element-name", "container");

    //NOTE Public Functions

    /**
     * @param {string} templateName
     */
    this.defineMethod("addTemplate", (templateName) => {
      let template = new BGridTemplate(templateName);
      templates[templateName] = template;
      document.head.appendChild(template.element);
    }, [String]);

    /**
     * @param {string} templateName
     * @returns {BGridTemplate}
     */
    this.defineMethod("getTemplate", (templateName) => {
      if (templateName in templates) {
        return templates[templateName];
      }
    }, [String]);

    /**
     * @param {string} templateName
     */
    this.defineMethod("removeTemplate", (templateName) => {
      if (templateName in templates) {
        document.head.removeChild(temlates[templateName].element);
        delete templates[templateName];
      }
    }, [String]);

    /**
     * @member {string}
     */
    this.defineProperty("title", {
      get() {
        return document.head.getElementsByTagName("title")[0].innerText;
      },
      set(v) {
        if (instanceOf(v, String)) {
          document.head.getElementsByTagName("title")[0].innerText = v;
        }
      },
      type: String
    });
  }
}

/**
 * @param {function} main
 */
/* Application.run = (main) => {
  if (instanceOf(main, "function")) {
    if (document.body) {
      main();
    } else {
      window.addEventListener("load", (e) => {
        main();
      });
    }
  }
}; */