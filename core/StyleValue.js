import {
  Events
} from "./Events.js";
import {
  BEvent
} from "../behaviors/BEvent.js";
import {
  forEach,
  Tigerian,
  instanceOf
} from "./Tigerian.js";

("use strict");

export class StyleValue extends Tigerian {
  /**
   * @param {Object} Type String
   * @param {String|Nuber} value undefined
   * @param {String} postfix 
   * @param  {...StyleValue} depends 
   */
  constructor(Type = String, value = undefined, postfix = "", ...depends) {
    super();
    this.config(BEvent);

    let that = this;
    let autoUpdate = () => {};
    Type = ((Type === String) || (Type = Number)) ? Type : String;

    forEach(depends, (variable) => {
      if (instanceOf(variable, StyleValue)) {
        variable.addEvent(Events.onChange, () => {
          this.value = autoUpdate();
        });
      }
    });

    this.defineProperty("type", {
      get() {
        return value;
      }
    });

    this.defineProperty("value", {
      get() {
        return value;
      },
      set(v) {
        let changed = (v !== value);
        value = v

        if (changed) {
          that.dispatchEvent(Events.onChange);
        }
      },
      type: [Type, undefined]
    });

    this.defineProperty("postfix", {
      get() {
        return postfix;
      },
      set(v) {
        postfix = v
      },
      type: String
    });

    this.defineProperty("autoUpdate", {
      get() {
        this.value = autoUpdate();
        return value;
      },
      set(v) {
        autoUpdate = v;
      },
      type: Function
    });

    this.defineMethod("fromHsl", (h, s, l, a = 100) => {
      if (Type == String) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
          x = c * (1 - Math.abs((h / 60) % 2 - 1)),
          m = l - c / 2,
          r = 0,
          g = 0,
          b = 0;

        if (0 <= h && h < 60) {
          r = c;
          g = x;
          b = 0;
        } else if (60 <= h && h < 120) {
          r = x;
          g = c;
          b = 0;
        } else if (120 <= h && h < 180) {
          r = 0;
          g = c;
          b = x;
        } else if (180 <= h && h < 240) {
          r = 0;
          g = x;
          b = c;
        } else if (240 <= h && h < 300) {
          r = x;
          g = 0;
          b = c;
        } else if (300 <= h && h < 360) {
          r = c;
          g = 0;
          b = x;
        }
        // Having obtained RGB, convert channels to hex
        let red = Math.round((r + m) * 255).toString(16);
        let green = Math.round((g + m) * 255).toString(16);
        let blue = Math.round((b + m) * 255).toString(16);
        let alpha = Math.round(a * 2.55).toString(16);

        if (red.length == 1) {
          red = `0${red}`;
        }
        if (green.length == 1) {
          green = `0${green}`;
        }
        if (blue.length == 1) {
          blue = `0${blue}`;
        }
        if (alpha.length == 1) {
          alpha = `0${alpha}`;
        }

        this.value = `#${red}${green}${blue}${alpha}`;
      }
    });

    this.defineMethod("fromRgb", (r, g, b, a = 100) => {
      if (Type == String) {
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
        a = Math.min(100, Math.max(0, a));

        let red = r.toString(16);
        let green = g.toString(16);
        let blue = b.toString(16);
        let alpha = Math.round(a * 2.55).toString(16);

        if (red.length == 1) {
          red = `0${red}`;
        }
        if (green.length == 1) {
          green = `0${green}`;
        }
        if (blue.length == 1) {
          blue = `0${blue}`;
        }
        if (alpha.length == 1) {
          alpha = `0${alpha}`;
        }

        this.value = `#${red}${green}${blue}${alpha}`;
      }
    }, [Number, Number, Number, Number]);
  }

  toString() {
    return this.value;
  }
}