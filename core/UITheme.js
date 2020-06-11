import {
  Tigerian,
  isA
} from "./Tigerian";
import {
  UI
} from "./UI";

("use strict");

export class UITheme extends Tigerian {
  /**
   * @param {Object} Type 
   */
  constructor(Type) {
    super()

    if (!isA(Type, UI)) {
      throw new Error("Type must be a class which extended from UI");
    }

    this.defineMethod("render", () => {

    });
  }
}