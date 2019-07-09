import { instanceOf } from "../core/Tigerian.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BFixElement}
 * @implements {BModal}
 */
Loading = Control.extend(
  {
    /**
     * @param {UI} parent
     * @param {string} theme = ""
     */
    init: function(parent, theme) {
      this.super(parent, theme);
      this.config("fix_element", BFixElement.ETop);
      this.config("modal", parent);

      var elmBar = document.createElement("div");
      var loaded = 0;

      this.setAttribute("element-type", "Loading");
      this.setAttribute("element-name", "container");
      this.setAttribute("element-situation", "opposite");

      elmBar.setAttribute("element-type", "Loading");
      elmBar.setAttribute("element-name", "bar");
      elmBar.setAttribute("element-situation", "danger");

      this.setAttribute("state", "indeterminate");

      this.addControl(elmBar);

      this.status = BModal.EClose;
      this.fixed = true;

      /**
       * @member {number}
       */
      Object.defineProperty(this, "loaded", {
        enumerable: true,
        configurable: true,
        get: function() {
          return loaded;
        },
        set: function(v) {
          if (instanceOf(v, "number")) {
            v = Math.max(0, Math.min(100, v));
            loaded = v;
            if (this.state === Loading.EDeterminate) {
              elmBar.style.width = `${v}%`;
            } else {
              elmBar.style.width = "";
            }
          }
        }
      });

      /**
       * @member {symbol}
       */
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        get: function() {
          var v = elmBar.getAttribute("state");
          switch (v) {
            case "determinate":
              return Loading.EDeterminate;

            case "indeterminate":
            default:
              return Loading.EIndeterminate;
          }
        },
        set: function(v) {
          switch (v) {
            case Loading.EDeterminate:
              this.setAttribute("state", "determinate");
              elmBar.style.width = `${loaded}%`;
              break;

            case Loading.EIndeterminate:
              this.setAttribute("state", "indeterminate");
              elmBar.style.width = "";
              break;

            default:
          }
        }
      });

      /**
       * @member {symbol}
       */
      Object.defineProperty(this, "barSituation", {
        enumerable: true,
        configurable: true,
        get: function() {
          var v = elmBar.getAttribute("element-situation");

          switch (v) {
            case "title":
              return Control.ETitle;

            case "default":
              return Control.EDefault;

            case "transparent":
              return Control.ETransparent;

            case "opposite":
              return Control.EOpposite;

            case "warning":
              return Control.EWarning;

            case "danger":
              return Control.EDanger;

            case "disable":
              return Control.EDisable;

            case "ok":
              return Control.EOk;

            default:
              return Control.ENone;
          }
        },
        set: function(v) {
          switch (v) {
            case Control.ETitle:
              elmBar.setAttribute("element-situation", "title");
              break;

            case Control.EDefault:
              elmBar.setAttribute("element-situation", "default");
              break;

            case Control.ETransparent:
              elmBar.setAttribute("element-situation", "transparent");
              break;

            case Control.EOpposite:
              elmBar.setAttribute("element-situation", "opposite");
              break;

            case Control.EWarning:
              elmBar.setAttribute("element-situation", "warning");
              break;

            case Control.EDanger:
              elmBar.setAttribute("element-situation", "danger");
              break;

            case Control.EDisable:
              elmBar.setAttribute("element-situation", "disable");
              break;

            case Control.EOk:
              elmBar.setAttribute("element-situation", "ok");
              break;

            case Control.ENone:
            default:
              elmBar.setAttribute("element-situation", "");
              break;
          }
        }
      });

      delete this.addControl;
    },
    enums: ["indeterminate", "determinate"]
  },
  BFixElement,
  BModal
);
