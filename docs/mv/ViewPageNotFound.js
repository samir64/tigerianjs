import {
  View
} from "../tigerianjs/model_view/View.js";
import {
  Control,
  EControl
} from "../tigerianjs/core/Control.js";
import {
  Label
} from "../tigerianjs/controls/Label.js";
import {
  Button
} from "../tigerianjs/controls/Button.js";

("use strict");

/**
 * @constructor
 * @extends {View}
 */
export class ViewPageNotFound extends View {
  /**
   * @constructs
   * @param {Tigerian.UI} parent
   */
  constructor(parent) {
    var container = new Control(parent, parent.theme);
    super(container);

    var content = new Label(container, "<h1>Topic Not Found</h1>", parent.theme);
    var btnBack = new Button(container, "Back", parent.theme);

    btnBack.situation = EControl.DANGER;

    btnBack.addEvent("click", (e) => {
      window.history.back();
    });
  }
}