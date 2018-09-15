/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BSelect}
 * @implements {Tigerian.BText}
 * @constructor
 */
Tigerian.RadioButton = Tigerian.Control.extend({
	/**
	 * @constructs
	 * @param {string} [text = ""]
	 * @param {string} [theme = ""]
	 * @param {Tigerian.UI} parent
	 */
	init: function (parent, text, theme) {
		var elmRadioButton = document.createElement("div");
		var elmLabel = document.createElement("div");

		this.super(parent, theme);
		this.config("select");
		this.config("text", elmLabel);


		//TODO Alias Super Members
		var superSelected = Object.getOwnPropertyDescriptor(this, "selected");


		//TODO Private Variables
		var instance = this;

		//TODO Attributes
		this.setAttribute("element-name", "container");
		this.setAttribute("element-type", "RadioButton");

		elmRadioButton.setAttribute("element-name", "button");
		elmRadioButton.setAttribute("element-type", "RadioButton");

		elmLabel.setAttribute("element-name", "label");
		elmLabel.setAttribute("element-type", "RadioButton");

		//TODO Append Children
		this.addControl(elmRadioButton);
		this.addControl(elmLabel);

		this.text = text;

		this.autoDeselect = false;

		Object.defineProperty(this, "autoDeselect", {
			enumerable: true,
			configurable: true,
			get: function () {
				return false;
			},
			set: function (v) {

			},
		});
	},
}, Tigerian.BSelect, Tigerian.BText);