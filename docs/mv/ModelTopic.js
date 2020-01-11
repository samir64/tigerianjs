import {
  Model
} from "../../model_view/Model.js";

("use strict");

/**
 * @constructor
 * @extends {Model}
 */
export class ModelTopic extends Model {
  /**
   * @constructs
   * @param {string} appPath
   */
  constructor(appPath) {
    super(appPath, "contents/topics.json", String);

    this.addField("name", String);
    this.addField("title", String);

    this.addField("children", ModelTopic, true);
  }
}