import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import {
  BBind
} from "../behaviors/BBind.js";
import {
  HyperLink
} from "./HyperLink.js";
import {
  Route
} from "../core/Route.js";

/**
 * @extends {Control}
 * @implements {BText}
 * @constructor
 */
export class Context extends Control {
  /**
   * @param {Control} parent
   * @param {String} text = ""
   * @param {Route} route = undefined

   *
   * @constructs
   */
  constructor(parent, text = "", route = undefined) {
    super(parent);

    let ctrlText = new Control(this);
    let ents = {};

    this.config(BText, ctrlText, text);
    this.addControl(ctrlText);

    // this.setAttribute("element-type", "Context");
    this.dataset.elementName = "container";
    // ctrlText.setAttribute("element-type", "Context");
    ctrlText.dataset.elementName = "content";

    let superText = Object.getOwnPropertyDescriptor(this, "text");

    /**
     * @param {String} t
     * @param {HTMLElement} ctrl
     */
    let processText = (t, ctrl) => {
      // ctrl.innerHTML = "";
      ctrl.clearContent();

      let match;
      let node;
      let tag;
      let commonText = "\\s+id\\s*=\\s*['\"](\\w+)['\"]\\s*>([^<]*)<\\/";
      let urlText = "\\s+url\\s*=\\s*['\"]([\\w\\/-]+)['\"]\\s*>([^<]*)<\\/";
      let pattern = `(?:<variable${commonText}variable>)|(?:<control${commonText}control>)|(?:<redirect${urlText}redirect>)`;
      let regex = new RegExp(pattern, "i");

      while ((match = t.match(regex))) {
        tag =
          match[0].toLowerCase().indexOf("</variable>") >= 0 ?
          "variable" :
          match[0].toLowerCase().indexOf("</control>") >= 0 ?
          "control" :
          "redirect";

        node = document.createTextNode(t.substr(0, match.index));
        ctrl.addControl(node);

        switch (tag) {
          case "variable":
            node = document.createTextNode(match[2]);
            (n => {
              Object.defineProperty(ents, match[1], {
                enumerable: true,
                configurable: true,
                get() {
                  return n.data;
                },
                set(v) {
                  n.data = v;
                }
              });
            })(node);
            ctrl.addControl(node);
            break;

          case "control":
            node = new Control(ctrl);
            if (match[4].indexOf("|")) {
              match[4] = match[4].split("|");
            } else {
              match[4] = [match[4], ""];
            }
            node.headText = match[4][0];
            node.footText = match[4][1];

            (n => {
              Object.defineProperty(ents, match[3], {
                enumerable: true,
                configurable: true,
                get() {
                  return n;
                }
              });
            })(node);
            break;

          case "redirect":
            node = new HyperLink(ctrl, match[6], match[5]);
            if (route) {
              node.addEvent(
                "click",
                (url => {
                  return e => {
                    e.preventDefault();
                    route.redirect(url);
                  };
                })(match[5])
              );
            }
            break;

          default:
        }

        t = t.substr(match.index + match[0].length);
      }

      node = document.createTextNode(t);
      ctrl.addControl(node);
    };

    Object.defineProperty(this, "text", {
      enumerable: true,
      configurable: true,
      get() {
        return superText.get();
      },
      set(v) {
        superText.set(v);
        processText(v, ctrlText);
      }
    });

    processText(text, ctrlText);

    Object.defineProperty(this, "entities", {
      enumerable: true,
      configurable: true,
      get() {
        return ents;
      }
    });
  }
}