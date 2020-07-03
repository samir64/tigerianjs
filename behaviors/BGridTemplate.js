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
} from "../core/Responsive.js";

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

    /**
     * 
     * @param {Object} that 
     * @param {String} name 
     */
    this.config = (that, name) => {
      let elm = document.createElement("style");
      document.head.appendChild(elm);

      // let columnGap = "0px";
      let templatesText = {};
      let blocks = [];

      elm.innerHTML = "";

      forEach(responsiveSizes, (size, sizeName) => {
        let node = document.createTextNode("");
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

      let getSizeName = (size) => {
        let result;

        forEach(responsiveSizes, (sizeInfo, sname) => {
          if (sizeInfo.name === size) {
            result = sname;
          }
        });

        return result;
      };

      /**
       * 
       * @param {BGridBlock} block 
       */
      that.addBlock = (block) => {
        blocks.push(block);
        that.regenerate
      };

      that.regenerate = () => {
        forEach(responsiveSizes, (size, sizeName) => {
          let template = "";
          forEach(blocks, (block) => {
            if (template !== "") {
              template += "\n";
            }
            template += block.regenerate(size.name);
          });

          let colCount = blocks[0].getColCount(size.name);
          // let colWidth = Math.round(10000 / colCount) / 100;
          templatesText[sizeName].data = `\t[element-name="container"][template-name="${name}"][visible="true"] {\n\t\tdisplay: grid;\n\t\t/*max-width: ${size.containerWidth};*/\n\t\tmargin-left: auto;\n\t\tmargin-right: auto;\n\t\tgrid-template-columns: repeat(${colCount}, minmax(0px, 1fr));\n\t\tgrid-template-areas:${template};\n\t}\n\n`;
          // templatesText[sizeName].data = `  [element-name="container"][template-name="${name}"][visible="true"] {\n    display: grid;\n    max-width: ${size.containerWidth};\n    margin-left: auto;\n    margin-right: auto;\n    grid-template-areas:\n${template};\ngrid-template-columns: repeat(${colCount}, 1fr);\n}\n\n`;
          // templatesText[sizeName].data = `  [element-name="container"][template-name="${name}"][visible="true"] {\n    display: grid;\n    column-gap: ${columnGap};\n    max-width: ${size.containerWidth};\n    margin-left: auto;\n    margin-right: auto;\n    grid-template-areas:\n${template};\ngrid-template-columns: repeat(${colCount}, calc(${size.containerWidth} / ${colCount} - ${columnGap}));\n}\n\n`;
        })
      };

      /**
       * @member {string}
       */
      Object.defineProperty(that, "name", {
        enumerable: true,
        configurable: true,
        get() {
          return name;
        },
        set(v) {
          name = v;
        }
      });

      /**
       * @member {Element}
       * @readonly
       */
      Object.defineProperty(that, "element", {
        enumerable: true,
        configurable: true,
        get() {
          return elm;
        }
      });

      /* Object.defineProperty(that, "columnGap", {
        enumerable: true,
        configurable: true,
        get() {
          return columnGap;
        },
        set(v) {
          columnGap = v;
        }
      }); */

      that.getTemplate = (size) => {
        return templates[getSizeName(size)];
      };
    };
  }
}