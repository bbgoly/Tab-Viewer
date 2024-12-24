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
	return {
		id: window.id,
		tabs: window.tabs.reduce((tabs, tab) => {
			tabs[tab.id] = buildTabData(tab);
			return tabs;
		}, {}),
		incognito: window.incognito,
		focused: window.focused,
	};
}

// check if this sends over a network
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "GET_ALL_WINDOWS") {
		chrome.windows.getAll({ populate: true }, windows => {
			const windowsData = windows.reduce((windowsAcc, window) => {
				windowsAcc[window.id] = buildWindowData(window);
				return windowsAcc;
			}, {});
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("from tabs updated: ", tabId, changeInfo, tab);
	if (tab.title !== tab.url && tab.favIconUrl && (changeInfo.status === "complete" || changeInfo.favIconUrl || changeInfo.discarded)) {
		chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
			console.log("found context? ", contexts.length);
			if (contexts.length > 0) {
				console.log("sending info:", changeInfo, buildTabData(tab));
				chrome.runtime.sendMessage({ type: "TAB_UPDATE", tabId, changeInfo, tab: buildTabData(tab) });
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
				chrome.runtime.sendMessage({ type: "TAB_DELETE", tabId, windowId: removeInfo.windowId });
			}
		});
	}
});

chrome.windows.onCreated.addListener(window => console.log("from window created: ", window), { windowTypes: ["normal"] });

chrome.windows.onRemoved.addListener(windowId => console.log("from window removed: ", windowId), { windowTypes: ["normal"] });

chrome.windows.onFocusChanged.addListener(windowId => console.log("from window focus changed: ", windowId), { windowTypes: ["normal"] });

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
