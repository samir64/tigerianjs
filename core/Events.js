/**
 * Created by samir on 10/28/16.
 */

"use strict";


/**
 * @constructor
 */
Tigerian.Event = function () {};

Tigerian.Event.onSelectedChange = new Event("SelectedChange", {
	detail: {
		message: "Selected Changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onIndeterminateChange = new Event("IndeterminateChange", {
	detail: {
		message: "Indeterminate Changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onItemIndexChange = new Event("ItemIndexChange", {
	detail: {
		message: "Item Index Changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onSelectedIndexChange = new Event("SelectedIndexChange", {
	detail: {
		message: "Selected Index Changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onSelectedCountChange = new Event("SelectedCountChange", {
	detail: {
		message: "Selected Count Changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onItemAdded = new Event("ItemAdded", {
	detail: {
		message: "Item Added To Group",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onFocus = new Event("Focus", {
	detail: {
		message: "Control get focus",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onBlur = new Event("Blur", {
	detail: {
		message: "Control lost focus",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onTextChanged = new Event("TextChanged", {
	detail: {
		message: "Control text changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onVisibleChanged = new Event("VisibleChanged", {
	detail: {
		message: "Control's visible changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});