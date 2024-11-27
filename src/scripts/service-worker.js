chrome.runtime.onInstalled.addListener(() => chrome.tabs.query({}, console.log));

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
	if (message.type === "GET_ALL_WINDOWS") {
		chrome.windows.getAll({ populate: true }, windows => {
			// see if including window.id in tab data is useful (unlikely)
			const windowsData = windows.map(window => ({
				id: window.id,
				tabs: window.tabs.map(tab => ({
					id: tab.id,
					title: tab.title,
					url: tab.url,
					discarded: tab.discarded,
					icon: tab.favIconUrl,
					windowId: tab.windowId,
				})),
				incognito: window.incognito,
				focused: window.focused,
			}));
			console.log(windowsData);
			sendResponse(windowsData);
		});
		return true;
	}
});

/*
 * tab.discarded
 * tab.windowId
 * will onUpdated also fire if onRemoved fires
 * check if onDetached will not fire so long as user detaches it and continues moving it (i.e., they might attach it to another window)
 * maybe debounce the onDetached if possible lol...
 */

// chrome.tabs.onCreated.addListener(tab => {});

// chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {});

// chrome.windows.onCreated.addListener(window => {}, ["normal"]);

// chrome.windows.onRemoved.addListener(windowId => {}, ["normal"]);

// chrome.windows.onFocusChanged(windowId => {}, ["normal"]);

chrome.action.onClicked.addListener(() => {
	console.log("loled");
	// chrome.tabs.create({ active: false, url: "index.html" });
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }, () => {
	console.log("loling");
});
