import { Button } from "../controls/Button.js";
import { Control } from "./Control.js";
import { Theme } from "./Theme.js";
// import {
  // changeStringCase,
  // enumToString,
  // EStringCase,
  // forEach,
  // instanceOf,
// } from "./Tigerian.js";
import { UI } from "./UI.js";

/**
 * @export
 * @class ThemeDefault
 * @extends {Theme}
 * @property {String} brandColorHue
 * @property {String} brandColor
 * @property {String} opaqueBrandColor
 * @property {String} brandFontColor
 */
export class ThemeDefault extends Theme {
  constructor() {
    super();

    UI.attribute(Control, "situation", ESituation, ESituation.NONE);

    let situations = {
      [ESituation.NONE]: { hue: 210, sat: 15, lum: 100 },
      [ESituation.DEFAULT]: { hue: 210, sat: 100, lum: 50 },
      [ESituation.TITLE]: { hue: 210, sat: 10, lum: 50 },
      [ESituation.INFO]: { hue: 190, sat: 80, lum: 40 },
      [ESituation.OPPOSITE]: { hue: 210, sat: 10, lum: 30 },
      [ESituation.WARNING]: { hue: 45, sat: 100, lum: 50 },
      [ESituation.ERROR]: { hue: 355, sat: 70, lum: 55 },
      [ESituation.OK]: { hue: 135, sat: 70, lum: 40 },
    };
    /**
     *
     * @param {ESituation} situation
     * @param {Object} color
     * @param {Number} color.hue
     * @param {Number} color.sat
     * @param {Number} color.lum
     */
    this.setSituationColor = (situation, { hue, sat, lum } = {}) => {
      // let name;
      // forEach(ESituation, (symbol, sitName) => {
      //   if (situation === symbol) {
      //     name = sitName;
      //   }
      // });
      if (situations[situation]) {
        if (hue) {
          situations[situation].hue = hue;
        } else {
          hue = situations[situation].hue;
        }
        if (sat) {
          situations[situation].sat = sat;
        } else {
          sat = situations[situation].sat;
        }
        if (lum) {
          situations[situation].lum = lum;
        } else {
          lum = situations[situation].lum;
        }

        let name = changeStringCase(
          EStringCase.PASCAL_CASE,
          enumToString(situation)
        );
        this[`situation${name}`] = `hsl(${hue}, ${sat}%, ${lum}%)`;
      }
    };

    forEach(situations, ([hue, sat, lum], key) => {
      let name = enumToString(key);
      name = name[0] + name.substring(1).toLowerCase();
      this.addVariable(
        `situation${name}`,
        String,
        `hsl(${hue}, ${sat}%, ${lum}%)`
      );
    });

    this.addRule(
      Button,
      { backgroundColor: this.variable("situationWarning") },
      {
        situation: ESituation.WARNING,
      }
    );
  }
}

export const ESituation = Object.freeze({
  NONE: Symbol("none"),
  DEFAULT: Symbol("default"),
  TITLE: Symbol("title"),
  INFO: Symbol("info"),
  TRANSPARENT: Symbol("transparent"),
  OPPOSITE: Symbol("opposite"),
  WARNING: Symbol("warning"),
  ERROR: Symbol("error"),
  OK: Symbol("ok"),
});
