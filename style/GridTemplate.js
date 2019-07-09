import {
  instanceOf,
  Tigerian,
  forEach
} from "../core/Tigerian.js";
import {
  EWindow
} from "../behaviors/BWindow.js";
import {
  GridTemplateAreas
} from "./GridTemplateAreas.js";
import {
  responsiveSizes
} from "./Responsive.js";

/**
 * Created by samir on 8/31/18.
 */

("use strict");

/**
 * @extends {Class}
 * @constructor
 */
export class GridTemplate extends Tigerian {
  /**
   * @constructs
   * @param {string} name
   */
  constructor(name) {
    if (instanceOf(name, String)) {
      super();

      var elm = document.createElement("style");
      /**
       * @var {GridTemplateAreas[]}
       */
      // var templates = [undefined, undefined, undefined, undefined, undefined];
      var templates = {};

      /* var templatesText = [];
      templatesText.push(document.createTextNode("@media only screen and (max-width: 599.98px) {\n{template}\n}"));
      templatesText.push(document.createTextNode("@media only screen and (min-width: 600px) {\n{template}\n}"));
      templatesText.push(document.createTextNode("@media only screen and (min-width: 768px) {\n{template}\n}"));
      templatesText.push(document.createTextNode("@media only screen and (min-width: 992px) {\n{template}\n}"));
      templatesText.push(document.createTextNode("@media only screen and (min-width: 1200px) {\n{template}\n}")); */
      var templatesText = {};

      elm.innerHTML = "";

      forEach(responsiveSizes, (size, sizeName) => {
        if (size.min) {
          elm.innerHTML += `@media only screen and (min-width: ${size.min}px) {\n`;
        } else {
          elm.innerHTML += `@media only screen and (max-width: ${size.max}px) {\n`;
        }

        var node = document.createTextNode("");
        templatesText[sizeName] = node;

        elm.appendChild(node);

        elm.innerHTML += "\n}\n\n";
      })

      this.defineMethod("setTemplate", (size, colCount, rowCount) => {
        var index;
        switch (size) {
          case EWindow.XSMALL:
            index = "xsmall";
            break;

          case EWindow.SMALL:
            index = "small";
            break;

          case EWindow.MEDIUM:
            index = "medium";
            break;

          case EWindow.LARGE:
            index = "large";
            break;

          case EWindow.XLARGE:
            index = "xlarge";
            break;

          default:
            index = -1;
        }

        if (index >= 0) {
          if (!templates[index]) {
            templates[index] = new GridTemplateAreas(templatesText[index], name, colCount, rowCount);
            // elm.appendChild(templatesText[index]);
          }
        }
      }, [Symbol, Number, Number]);

      /**
       * @member {string}
       */
      this.defineProperty("name", {
        get() {
          return name;
        },
        set(v) {
          name = v;
        },
        type: String
      });

      /**
       * @member {Element}
       * @readonly
       */
      this.defineProperty("element", {
        get() {
          return elm;
        },
      });

      /**
       * @member {GridTemplateAreas}
       * @readonly
       */
      this.defineProperty("xsmall", {
        /**
         * @returns {GridTemplateAreas}
         */
        get() {
          return templates[0];
        },
      });

      forEach(responsiveSizes, (size, sizeName) => {
        this.defineProperty(sizeName, {
          /**
           * @returns {GridTemplateAreas}
           */
          get() {
            return templates[sizeName];
          },
        });
      });
    }
  }
}