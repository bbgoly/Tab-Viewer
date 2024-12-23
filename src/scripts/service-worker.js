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
			console.log("sending all tabs:", windowsData);
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

let newTabCompare = [];

chrome.tabs.onCreated.addListener(tab => {
	console.log("from tabs created: ", tab);
	newTabCompare.push(tab);
	chrome.runtime.sendMessage({ type: "TAB_CREATED", tab });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log("from tabs removed: ", tabId, removeInfo);
	console.log("isequal: ");
	for (let i = 0; i < 3; i++) {
		console.log(newTabCompare[i]);
	}

	const prevInfo = newTabCompare[1];
	for (const [k, v] of Object.entries(newTabCompare[2])) {
		if (typeof prevInfo[k] === "object") {
			for (const [k2, v2] of Object.entries(newTabCompare[2][k])) {
				if (prevInfo[k][k2] !== v2) {
					console.log("deep diff", k, "(", k2, ")", ":", prevInfo[k][k2], v2);
				}
			}
		} else if (prevInfo[k] !== v) {
			console.log("diff", k, ":", prevInfo[k], v);
		}
	}
	console.log(newTabCompare[1] === newTabCompare[2]);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("from tabs updated: ", tabId, changeInfo);
	if (changeInfo.url || changeInfo.discarded) {
		newTabCompare.push(tab);
		chrome.runtime.sendMessage({ type: "TAB_UPDATED", tabId, tab });
	}
});

chrome.windows.onCreated.addListener(window => console.log("from window created: ", window), { windowTypes: ["normal"] });

chrome.windows.onRemoved.addListener(windowId => console.log("from window removed: ", windowId), { windowTypes: ["normal"] });

chrome.windows.onFocusChanged.addListener(windowId => console.log("from window focus changed: ", windowId), { windowTypes: ["normal"] });

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
