function buildTabData(tab) {
	// see if tab.windowId is useful
	return {
		id: tab.id,
		title: tab.title,
		url: tab.url,
		active: tab.active,
		discarded: tab.discarded,
		icon: tab.favIconUrl,
		windowId: tab.windowId,
	};
}

function buildWindowData(window) {
	let activeTabId = -1;
	return {
		id: window.id,
		tabs: (window.tabs ?? []).reduce((tabs, tab) => {
			const data = buildTabData(tab);
			tabs[tab.id] = data;

			if (data.active) {
				activeTabId = data.id;
			}
			return tabs;
		}, {}),
		activeTabId,
		incognito: window.incognito,
		focused: window.focused,
	};
}

// check if this sends over a network
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "GET_ALL_WINDOWS") {
		chrome.windows.getAll({ populate: true, windowTypes: ["normal"] }, windows => {
			const windowsData = windows.reduce((windowsAcc, window) => {
				windowsAcc[window.id] = buildWindowData(window);
				return windowsAcc;
			}, {});
			console.log("windows data:", windowsData);
			sendResponse(windowsData);
		});
		return true;
	}
});

/*
 * tab.discarded ✅
 * tab.windowId	 ✅
 * will onUpdated also fire if onRemoved fires: ❌
 * maybe use only onUpdated instead of onCreated: ✅
 * maybe only care about window focus change during popout mode
 * check if onDetached will not fire so long as user detaches it and continues moving it (i.e., they might attach it to another window)
 * maybe debounce the onDetached if possible lol...
 * figure out a way to make service worker know when user creates a new tab/window or if the extension created a new tab/window
 */

// chrome.tabs.onCreated.addListener(tab => {
// 	console.log("from tabs created: ", tab);
// 	chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
// 		console.log("found context? ", contexts.length);
// 		if (contexts.length > 0) {
// 			chrome.runtime.sendMessage({ type: "TAB_CREATE", tab: buildTabData(tab) });
// 		}
// 	});
// });

chrome.tabs.onActivated.addListener(activeInfo => {
	console.log("from tabs active: ", activeInfo);
	chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
		console.log("found context? ", contexts.length);
		if (contexts.length > 0) {
			chrome.runtime.sendMessage({ type: "ACTIVE_TAB_CHANGED", tabId: activeInfo.tabId, windowId: activeInfo.windowId });
		}
	});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("from tabs updated: ", tabId, changeInfo, tab);
	if (
		tab.title !== tab.url &&
		tab.favIconUrl &&
		tab.status === "complete" &&
		(changeInfo.status === "complete" || changeInfo.title || changeInfo.favIconUrl || changeInfo.discarded)
	) {
		chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
			console.log("found context? ", contexts.length);
			if (contexts.length > 0) {
				console.log("sending info:", changeInfo, buildTabData(tab));
				chrome.runtime.sendMessage({ type: "TAB_UPDATED", tabId, changeInfo, tab: buildTabData(tab) });
			}
		});
	}
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log("from tabs removed: ", tabId, removeInfo);
	if (!removeInfo.isWindowClosing) {
		chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
			console.log("found context? ", contexts.length);
			if (contexts.length > 0) {
				chrome.runtime.sendMessage({ type: "TAB_DELETED", tabId, windowId: removeInfo.windowId });
			}
		});
	}
});

chrome.windows.onCreated.addListener(
	window => {
		console.log("from window created: ", window);
		chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
			console.log("found context? ", contexts.length);
			if (contexts.length > 0) {
				chrome.runtime.sendMessage({ type: "WINDOW_CREATED", window: buildWindowData(window) });
			}
		});
	},
	{ windowTypes: ["normal"] }
);

// TODO: windows.onRemoved never fires for some reason, workaround could be to just use tabs.onRemoved with isWindowClosing to create a special case since that triggers for each tab being closed
chrome.windows.onRemoved.addListener(
	windowId => {
		console.log("from window removed: ", windowId);
		chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
			console.log("found context? ", contexts.length);
			if (contexts.length > 0) {
				chrome.runtime.sendMessage({ type: "WINDOW_DELETED", windowId });
			}
		});
	},
	{ windowTypes: ["normal"] }
);

// TODO: If you decide to create a popout, implement this for it
// chrome.windows.onFocusChanged.addListener(
// 	windowId => {
// 		console.log("from window focus changed: ", windowId);
// 		chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
// 			console.log("found context? ", contexts.length);
// 			if (contexts.length > 0) {
// 				chrome.runtime.sendMessage({ type: "WINDOW_FOCUS_CHANGED", windowId });
// 			}
// 		});
// 	},
// 	{ windowTypes: ["normal"] }
// );

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
