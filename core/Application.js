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
// import {
//   responsive
// } from "./Responsive.js";
// import {
//   ThemeDefault
// } from "./ThemeDefault.js";

/**
 * Created by samir on 8/25/16.
 * Version 1.0.0.100
 */

"use strict";

/**
 * @constructor
 * @extends {UI}
 */
export class Application extends UI {
  /**
   * @constructs
   * @param {Element} [element = document.body]
   * @param {string} [title = ""]
   */
  constructor(title = "", element = document.body) {
    // let fragment = document.createDocumentFragment();
    super(element, null);

    this.config(BWindow);

    /**
     * @type {BGridTemplate[]}
     */
    let templates = [];
    if (instanceOf(title, String)) {
      document.head.getElementsByTagName("title")[0].innerText = title;
    }

    //NOTE Attributes
    // this.setAttribute("element-type", "Application");
    this.elementName = "container";

    //NOTE Public Functions

    /**
     * @param {String} templateName
     */
    this.addTemplate = (templateName) => {
      let template = new BGridTemplate(templateName);
      templates[templateName] = template;
      document.head.appendChild(template.element);
    };

    /**
     * @param {String} templateName
     * @returns {BGridTemplate}
     */
    this.getTemplate = (templateName) => {
      if (templateName in templates) {
        return templates[templateName];
      }
    };

    /**
     * @param {String} templateName
     */
    this.removeTemplate = (templateName) => {
      if (templateName in templates) {
        document.head.removeChild(temlates[templateName].element);
        delete templates[templateName];
      }
    };

    /**
     * @member {string}
     */
    Object.defineProperty(this, "title", {
      enumerable: true,
      configurable: true,
      get() {
        return document.head.getElementsByTagName("title")[0].innerText;
      },
      set(v) {
        if (instanceOf(v, String)) {
          document.head.getElementsByTagName("title")[0].innerText = v;
        }
      }
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