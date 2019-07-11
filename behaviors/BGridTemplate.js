import {
  forEach
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";
import {
  BGridBlock
} from "./BGridBlock.js";
import {
  responsiveSizes
} from "../style/Responsive.js";

/**
 * Created by samir on 8/31/18.
 */

("use strict");

/**
 * @extends {Class}
 * @constructor
 */
export class BGridTemplate extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.defineMethod("config", (that, name) => {
      var elm = document.createElement("style");
      document.head.appendChild(elm);

      var templatesText = {};
      var blocks = [];

      elm.innerHTML = "";

      forEach(responsiveSizes, (size, sizeName) => {
        var node = document.createTextNode("");
        if (size.min) {
          node.data = `@media only screen and (min-width: ${size.min}px) {\n`;
        } else {
          node.data = `@media only screen and (max-width: ${size.max}px) {\n`;
        }
        elm.appendChild(node);

        node = document.createTextNode("/**/");
        templatesText[sizeName] = node;
        elm.appendChild(node);

        node = document.createTextNode("\n}\n\n");
        elm.appendChild(node);
      });

      var getSizeName = (size) => {
        var result;

        forEach(responsiveSizes, (sizeInfo, sname) => {
          if (sizeInfo.name === size) {
            result = sname;
          }
        });

        return result;
      };

      that.defineMethod("addBlock", (block) => {
        blocks.push(block);
        that.regenerate
      }, [BGridBlock]);

      that.defineMethod("regenerate", () => {
        forEach(responsiveSizes, (size, sizeName) => {
          var template = "";
          forEach(blocks, (block) => {
            template += block.regenerate(size.name);
          });
          templatesText[sizeName].data = `  [element-name="container"][template-name="${name}"][visible="true"] {\n    display: grid;\n    max-width: ${size.containerWidth};\n    margin-left: auto;\n    margin-right: auto;\n    grid-template-areas:\n${template}\n}\n\n`;
        })
      });

      /**
       * @member {string}
       */
      that.defineProperty("name", {
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
      that.defineProperty("element", {
        get() {
          return elm;
        },
      });

      that.defineMethod("getTemplate", (size) => {
        return templates[getSizeName(size)];
      });
    }, [Object, String]);
  }
}