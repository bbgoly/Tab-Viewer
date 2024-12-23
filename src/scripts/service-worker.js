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
		tabs: window.tabs.map(tab => buildTabData(tab)),
		incognito: window.incognito,
		focused: window.focused,
	};
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "GET_ALL_WINDOWS") {
		chrome.windows.getAll({ populate: true }, windows => {
			const windowsData = windows.map(window => buildWindowData(window));
			console.log("sending all tabs:", windowsData);
			sendResponse(windowsData);
		});
		return true;
	}
});

/*
 * tab.discarded
 * tab.windowId
 * will onUpdated also fire if onRemoved fires: No
 * check if onDetached will not fire so long as user detaches it and continues moving it (i.e., they might attach it to another window)
 * maybe debounce the onDetached if possible lol...
 * maybe use only onUpdated instead of onCreated
 * figure out a way to make service worker know when user creates a new tab/window or if the extension created a new tab/window
 */

chrome.tabs.onCreated.addListener(tab => {
	console.log("from tabs created: ", tab);
	chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
		console.log("found context? ", contexts.length);
		if (contexts.length > 0) {
			tab.chrome.runtime.sendMessage({ type: "TAB_CREATE", tab: buildTabData(tab) });
		}
	});
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("from tabs updated: ", tabId, changeInfo, tab);
	if (changeInfo.status === "complete" || changeInfo.favIconUrl || changeInfo.discarded) {
		chrome.runtime.getContexts({ contextTypes: ["POPUP", "SIDE_PANEL"] }).then(contexts => {
			console.log("found context? ", contexts.length);
			if (contexts.length > 0) {
				chrome.runtime.sendMessage({ type: "TAB_UPDATE", tabId, changeInfo, tab: buildTabData(tab) });
			}
		});
	}
});

chrome.windows.onCreated.addListener(window => console.log("from window created: ", window), { windowTypes: ["normal"] });

chrome.windows.onRemoved.addListener(windowId => console.log("from window removed: ", windowId), { windowTypes: ["normal"] });

chrome.windows.onFocusChanged.addListener(windowId => console.log("from window focus changed: ", windowId), { windowTypes: ["normal"] });

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
