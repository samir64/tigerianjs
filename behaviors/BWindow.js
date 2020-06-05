import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";

/**
 * Created by samir on 9/14/18.
 */

("use strict");

/**
 * @namespace {Tigerian}
 * @extends {Behavior}
 * @interface
 */
export class BWindow extends Behavior {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.defineMethod("config", (that) => {
      let windowSmallMatch = window.matchMedia("(max-width: 575.98px)");
      let windowMediumMatch = window.matchMedia(
        "(min-width: 576px) and (max-width: 767.98px)"
      );
      let windowNormalMatch = window.matchMedia(
        "(min-width: 768px) and (max-width: 991.98px)"
      );
      let windowLargeMatch = window.matchMedia(
        "(min-width: 992px) and (max-width: 1199.98px)"
      );
      let windowXlargeMatch = window.matchMedia("(min-width: 1200px)");

      let onSmallWindow = function (e) {};
      let onMediumWindow = function (e) {};
      let onNormalWindow = function (e) {};
      let onLargeWindow = function (e) {};
      let onXlargeWindow = function (e) {};

      /**
       * @member {Symbol}
       */
      that.defineProperty("windowSize", {
        get() {
          if (windowSmallMatch.matches) {
            return EWindow.XSMALL;
          }

          if (windowMediumMatch.matches) {
            return EWindow.SMALL;
          }

          if (windowNormalMatch.matches) {
            return EWindow.MEDIUM;
          }

          if (windowLargeMatch.matches) {
            return EWindow.LARGE;
          }

          if (windowXlargeMatch.matches) {
            return EWindow.XLARGE;
          }
        }
      });

      /**
       * @member {function}
       */
      that.defineProperty("onSmallWindow", {
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onSmallWindow = v;
            if (windowSmallMatch.matches) {
              v();
            }
          }
        },
        type: Function
      });

      /**
       * @member {function}
       */
      that.defineProperty("onMediumWindow", {
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onMediumWindow = v;
            if (windowMediumMatch.matches) {
              v();
            }
          }
        },
        type: Function
      });

      /**
       * @member {function}
       */
      that.defineProperty("onNormalWindow", {
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onNormalWindow = v;
            if (windowNormalMatch.matches) {
              v();
            }
          }
        },
        type: Function
      });

      /**
       * @member {function}
       */
      that.defineProperty("onLargeWindow", {
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onLargeWindow = v;
            if (windowLargeMatch.matches) {
              v();
            }
          }
        },
        type: Function
      });

      /**
       * @member {function}
       */
      that.defineProperty("onXlargeWindow", {
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onXlargeWindow = v;
            if (windowXlargeMatch.matches) {
              v();
            }
          }
        },
        type: Function
      });

      windowSmallMatch.addListener(function (e) {
        if (e.matches) {
          onSmallWindow();
        }
      });

      windowMediumMatch.addListener(function (e) {
        if (e.matches) {
          onMediumWindow();
        }
      });

      windowNormalMatch.addListener(function (e) {
        if (e.matches) {
          onNormalWindow();
        }
      });

      windowLargeMatch.addListener(function (e) {
        if (e.matches) {
          onLargeWindow();
        }
      });

      windowXlargeMatch.addListener(function (e) {
        if (e.matches) {
          onXlargeWindow();
        }
      });
    });
  }
}


export const EWindow = Object.freeze({
  NONE: Symbol("none"),
  XSMALL: Symbol("xsmall"),
  SMALL: Symbol("small"),
  MEDIUM: Symbol("medium"),
  LARGE: Symbol("large"),
  XLARGE: Symbol("xLarge")
});