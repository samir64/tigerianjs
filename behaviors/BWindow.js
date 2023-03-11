// import {
//   instanceOf
// } from "../core/Tigerian.js";
import {
  Behavior
} from "../core/Behavior.js";

/**
 * Created by samir on 9/14/18.
 */

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

    this.config = (that) => {
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

      let onSmallWindow = (e) => {};
      let onMediumWindow = (e) => {};
      let onNormalWindow = (e) => {};
      let onLargeWindow = (e) => {};
      let onXlargeWindow = (e) => {};

      /**
       * @member {Symbol}
       */
      Object.defineProperty(that, "windowSize", {
        enumerable: true,
        configurable: true,
        get() {
          if (windowSmallMatch.matches) {
            return EResponsive.XSMALL;
          }

          if (windowMediumMatch.matches) {
            return EResponsive.SMALL;
          }

          if (windowNormalMatch.matches) {
            return EResponsive.MEDIUM;
          }

          if (windowLargeMatch.matches) {
            return EResponsive.LARGE;
          }

          if (windowXlargeMatch.matches) {
            return EResponsive.XLARGE;
          }
        }
      });

      /**
       * @member {function}
       */
      Object.defineProperty(that, "onSmallWindow", {
        enumerable: true,
        configurable: true,
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onSmallWindow = v;
            if (windowSmallMatch.matches) {
              v();
            }
          }
        }
      });

      /**
       * @member {function}
       */
      Object.defineProperty(that, "onMediumWindow", {
        enumerable: true,
        configurable: true,
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onMediumWindow = v;
            if (windowMediumMatch.matches) {
              v();
            }
          }
        }
      });

      /**
       * @member {function}
       */
      Object.defineProperty(that, "onNormalWindow", {
        enumerable: true,
        configurable: true,
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onNormalWindow = v;
            if (windowNormalMatch.matches) {
              v();
            }
          }
        }
      });

      /**
       * @member {function}
       */
      Object.defineProperty(that, "onLargeWindow", {
        enumerable: true,
        configurable: true,
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onLargeWindow = v;
            if (windowLargeMatch.matches) {
              v();
            }
          }
        }
      });

      /**
       * @member {function}
       */
      Object.defineProperty(that, "onXlargeWindow", {
        enumerable: true,
        configurable: true,
        set(v) {
          if (instanceOf(v, "function")) {
            v = v.bind(that);
            onXlargeWindow = v;
            if (windowXlargeMatch.matches) {
              v();
            }
          }
        }
      });

      windowSmallMatch.addListener(e => {
        if (e.matches) {
          onSmallWindow();
        }
      });

      windowMediumMatch.addListener(e => {
        if (e.matches) {
          onMediumWindow();
        }
      });

      windowNormalMatch.addListener(e => {
        if (e.matches) {
          onNormalWindow();
        }
      });

      windowLargeMatch.addListener(e => {
        if (e.matches) {
          onLargeWindow();
        }
      });

      windowXlargeMatch.addListener(e => {
        if (e.matches) {
          onXlargeWindow();
        }
      });
    };
  }
}


// export const EWindow = Object.freeze({
//   NONE: Symbol("none"),
//   XSMALL: Symbol("xsmall"),
//   SMALL: Symbol("small"),
//   MEDIUM: Symbol("medium"),
//   LARGE: Symbol("large"),
//   XLARGE: Symbol("xLarge")
// });