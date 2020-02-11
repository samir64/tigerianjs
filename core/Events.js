/**
 * Created by samir on 10/28/16.
 */

("use strict");

export let Events = {};

Events.onChange = new Event("Change", {
	detail: {
		message: "Changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onSelectedChange = new Event("SelectedChange", {
	detail: {
		message: "Selected changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onIndeterminateChange = new Event("IndeterminateChange", {
	detail: {
		message: "Indeterminate changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onItemIndexChange = new Event("ItemIndexChange", {
	detail: {
		message: "Item index changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onSelectedIndexChange = new Event("SelectedIndexChange", {
	detail: {
		message: "Selected index changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onSelectedCountChange = new Event("SelectedCountChange", {
	detail: {
		message: "Selected count changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onAdd = new Event("Add", {
	detail: {
		message: "Added",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onRemove = new Event("Remove", {
	detail: {
		message: "Removed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onFocus = new Event("Focus", {
	detail: {
		message: "Control get focus",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onBlur = new Event("Blur", {
	detail: {
		message: "Control lost focus",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onTextChange = new Event("TextChanged", {
	detail: {
		message: "Control text changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onVisibleChange = new Event("VisibleChanged", {
	detail: {
		message: "Control's visible changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onNextPage = new Event("NextPage", {
	detail: {
		message: "Next page",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onPreviousPage = new Event("PreviousPage", {
	detail: {
		message: "Previous page",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onViewChange = new Event("ViewChanged", {
	detail: {
		message: "View changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onViewRefresh = new Event("ViewRefresh", {
	detail: {
		message: "View refreshed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onPageChange = new Event("PageChanged", {
	detail: {
		message: "Page changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onPageCountChange = new Event("PageCountChanged", {
	detail: {
		message: "Page count changed",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
});

Events.onTransition = new Event("Transition", {
	detail: {
		message: "Transition",
		time: new Date()
	},
	bubbles: true,
	cancelable: true
})