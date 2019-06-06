/**
 * Created by samir on 10/28/16.
 */

"use strict";

Tigerian.Event = {};
Tigerian.Event.onChange = new Event("Change", {
	detail: {
		message: "Changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onSelectedChange = new Event("SelectedChange", {
	detail: {
		message: "Selected changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onIndeterminateChange = new Event("IndeterminateChange", {
	detail: {
		message: "Indeterminate changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onItemIndexChange = new Event("ItemIndexChange", {
	detail: {
		message: "Item index changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onSelectedIndexChange = new Event("SelectedIndexChange", {
	detail: {
		message: "Selected index changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onSelectedCountChange = new Event("SelectedCountChange", {
	detail: {
		message: "Selected count changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onAdd = new Event("Add", {
	detail: {
		message: "Added",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onRemove = new Event("Remove", {
	detail: {
		message: "Removed",
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

Tigerian.Event.onTextChange = new Event("TextChanged", {
	detail: {
		message: "Control text changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onVisibleChange = new Event("VisibleChanged", {
	detail: {
		message: "Control's visible changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onNextPage = new Event("NextPage", {
	detail: {
		message: "Next page",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onPreviousPage = new Event("PreviousPage", {
	detail: {
		message: "Previous page",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onViewChange = new Event("ViewChanged", {
	detail: {
		message: "View changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onViewRefresh = new Event("ViewRefresh", {
	detail: {
		message: "View refreshed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onPageChange = new Event("PageChanged", {
	detail: {
		message: "Page changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});

Tigerian.Event.onPageCountChange = new Event("PageCountChanged", {
	detail: {
		message: "Page count changed",
		time: new Date(),
	},
	bubbles: true,
	cancelable: true,
});