/**
 * Created by samir on 8/26/16.
 */

("use strict");


/**
 * @extends {Control}
 * @implements {BSelect}
 * @implements {BText}
 * @constructor
 */
RadioButton = Control.extend({
	/**
	 * @constructs
	 * @param {UI} parent
	 * @param {string} [text = ""]
	 * @param {string} [theme = ""]
	 */
	init: function (parent, text, theme) {
		var elmRadioButton = document.createElement("div");
		var elmLabel = document.createElement("div");

		this.super(parent, theme);
		this.config("select");
		this.config("text", elmLabel);


		//NOTE Alias Super Members
		var superSelected = Object.getOwnPropertyDescriptor(this, "selected");


		//NOTE Private Variables
		var instance = this;

		//NOTE Attributes
		this.setAttribute("element-name", "container");
		this.setAttribute("element-type", "RadioButton");

		elmRadioButton.setAttribute("element-name", "button");
		elmRadioButton.setAttribute("element-type", "RadioButton");
		elmRadioButton.setAttribute("element-situation", "");
		elmRadioButton.setAttribute("element-hoverable", "true");

		// elmLabel.setAttribute("element-name", "label");
		elmLabel.setAttribute("element-type", "RadioButton");

		//NOTE Append Children
		this.addControl(elmRadioButton);
		this.addControl(elmLabel);

		this.text = text;

		this.autoDeselect = false;

		/**
		 * @member {boolean}
		 */
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
}, BSelect, BText);