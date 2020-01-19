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
  defineProperty
} from "../core/Tigerian.js";
import {
  HyperLink
} from "./HyperLink.js";
import {
  Route
} from "../core/Route.js";

/**
 * @extends {Control}
 * @constructor
 */
export class Context extends Control {
  /**
   * @param {Control} parent
   * @param {String} text = ""
   * @param {Route} route = undefined
   * @param {String} theme = ""
   * 
   * @constructs
   */
  constructor(parent, text = "", route = undefined, theme = "") {
    super(parent, theme);

    this.setAttribute("element-type", "Context");
    this.setAttribute("element-name", "container");

    let ctrlText = new Control(this, theme);
    let ents = {};

    this.config(BText, ctrlText, text);
    this.config(BBind);

    this.addControl(ctrlText);

    /**
     * @param {String} t
     * @param {HTMLElement} ctrl
     */
    let processText = (t, ctrl) => {
      // ctrl.innerHTML = "";

      let match;
      let node;
      let tag;
      let commonText = "\\s+id\\s*=\\s*['\"](\\w+)['\"]\\s*>([^<]*)<\\/";
      let urlText = "\\s+url\\s*=\\s*['\"]([\\w\\/-]+)['\"]\\s*>([^<]*)<\\/";
      let pattern = `(?:<variable${commonText}variable>)|(?:<control${commonText}control>)|(?:<redirect${urlText}redirect>)`
      let regex = new RegExp(pattern, "i");

      while (match = t.match(regex)) {
        tag = ((match[0].toLowerCase().indexOf("</variable>") >= 0) ? "variable" : ((match[0].toLowerCase().indexOf("</control>") >= 0) ? "control" : "redirect"));

        node = document.createTextNode(t.substr(0, match.index));
        ctrl.addControl(node);

        switch (tag) {
          case "variable":
            node = document.createTextNode(match[2]);
            defineProperty(ents, match[1], {
              get() {
                return node.data;
              },
              set(v) {
                node.data = v;
              },
              type: String
            });
            ctrl.addControl(node);
            break;

          case "control":
            ents[match[3]] = new Control(ctrl, theme);
            if (match[4].indexOf("|")) {
              match[4] = match[4].split("|");
            } else {
              match[4] = [match[4], ""];
            }
            ents[match[3]].headText = match[4][0];
            ents[match[3]].footText = match[4][1];
            break;

          case "redirect":
            node = new HyperLink(ctrl, match[6], match[5], theme);
            if (route) {
              node.addEvent("click", ((url) => {
                return (e) => {
                  e.preventDefault();
                  route.redirect(url);
                }
              })(match[5]));
            }
            break;

          default:
        }

        t = t.substr(match.index + match[0].length);
      }
    };


    //TODO Override set text function on BText behavior for get variables and controls in text and replace them to TextNode and Control.
    processText(text, ctrlText);

    defineProperty(this, "entities", {
      get() {
        return ents;
      }
    });
  }
}