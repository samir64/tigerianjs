/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @extends {Tigerian.Control}
 * @implements {Tigerian.Select}
 * @constructor
 */
Tigerian.CheckBox = Tigerian.Control.extend({
	/**
	 * @constructs
	 * @param {string} [text = ""]
	 * @param {string} [theme = ""]
	 * @param {Tigerian.UI} parent
	 */
	init: function (parent, text, theme) {
		var elmCheckBox = document.createElement("div");
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
		this.setAttribute("element-type", "CheckBox");

		elmCheckBox.setAttribute("element-name", "check");
		elmCheckBox.setAttribute("element-type", "CheckBox");

		elmLabel.setAttribute("element-name", "label");
		elmLabel.setAttribute("element-type", "CheckBox");

		//TODO Append Children
		this.addControl(elmCheckBox);
		this.addControl(elmLabel);

		this.text = text;


		//TODO Properties
		// Object.defineProperty(this, "text", {
		// 	enumerable: true,
		// 	configurable: true,
		// 	get: function () {
		// 		return elmLabel.text;
		// 	},

		// 	set: function (value) {
		// 		if (Tigerian.Class.isInstance(value, "string")) {
		// 			elmLabel.headText = value;
		// 		}
		// 	}
		// });

		Object.defineProperty(this, "indeterminate", {
			enumerable: true,
			configerable: true,
			get: function () {
				return instance.getAttribute("selected") == "indeterminate";
			},
			set: function (value) {
				if (Tigerian.Class.isInstance(value, "boolean")) {
					var lastValue = instance.indeterminate;

					instance.setAttribute("selected", value ? "indeterminate" : "false");

					if (value != lastValue) {
						instance.dispatchEvent(Tigerian.Event.onIndeterminateChange);
					}
				}
			}
		});

		Object.defineProperty(this, "selected", {
			enumerable: true,
			configerable: true,
			get: superSelected.get.bind(this),
			set: function (v) {
				if (Tigerian.Class.isInstance(v, "boolean")) {
					instance.indeterminate = false;
					superSelected.set.bind(this)(v);
				}
			}
		});

		/*
			Object.defineProperty(this, "triState", {
				enumerable: true,
				configerable: true,
				get: function () {
					return instance.getAttribute("tri-state") == "true";
				},
				set: function (value) {
					if (Tigerian.Class.isInstance(value, "boolean")) {
						instance.setAttribute("tri-state", value);
					}
				}
			});
		*/


		//TODO Private Functions
		/*
			function onClick(e) {
				superSetSelected(!instance.selected);
				elmCheckBox.checked = instance.selected;
			}
		*/


		//TODO Default Event
		// this.addEvent("click", onClick);


		//TODO Constructor Statements
		// delete this.selectMode;
		// delete this.deselectMode;
	},
}, Tigerian.BSelect, Tigerian.BText);