import { useState, useEffect, useMemo } from "react";

import Window from "./Window";
import TabSearch from "./TabSearch";
import Accordian from "./Accordian";

import useDebounce from "@/hooks/useDebounce";

function TabList() {
	// use hashmap instead of array to perform two extra O(n) operations when
	// constructing the object in favor of instead of many O(n^2) operations when updating the array
	const [windows, setWindows] = useState({});

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query);

	const queriedWindows = useMemo(() => {
		return Object.values(windows)
			.sort((win1, win2) => win2.focused - win1.focused)
			.map(window => ({
				...window,
				tabs: !debouncedQuery
					? Object.values(window.tabs)
					: Object.values(window.tabs).filter(tab => {
							const query = debouncedQuery.toLowerCase();
							return tab.title.toLowerCase().includes(query) || tab.url.toLowerCase().includes(query);
					  }),
			}));
	}, [windows, debouncedQuery]);

	useEffect(() => {
		function onBrowserWindowEvent(message) {
			switch (message.type) {
				case "TAB_UPDATED":
					setWindows(prevWindows => {
						if (!prevWindows[message.tab.windowId]) return prevWindows;

						const updatedWindows = { ...prevWindows };
						const window = updatedWindows[message.tab.windowId];
						// make sure when new window is created, this doesn't cancel tab data update
						console.log("old active tab:", window.tabs[window.activeTabId], message.tab.id);
						if (message.tab.active && window.activeTabId !== message.tab.id) {
							console.log("old active tab:", window.tabs[window.activeTabId]);
							if (window.tabs[window.activeTabId]) window.tabs[window.activeTabId].active = false;
							window.activeTabId = message.tab.id;
						}
						window.tabs[message.tab.id] = message.tab;
						return updatedWindows;
					});
					break;
				case "TAB_DELETED":
					setWindows(prevWindows => {
						if (!prevWindows[message.windowId]?.tabs[message.tabId]) return prevWindows;

						const updatedWindows = { ...prevWindows };
						delete updatedWindows[message.windowId].tabs[message.tabId];
						return updatedWindows;
					});
					break;
				case "ACTIVE_TAB_CHANGED":
					setWindows(prevWindows => {
						if (!prevWindows[message.windowId]?.tabs[message.tabId]) return prevWindows;

						const updatedWindows = { ...prevWindows };
						const window = updatedWindows[message.windowId];
						if (window.tabs[window.activeTabId]) {
							window.tabs[window.activeTabId].active = false;
						}

						window.tabs[message.tabId].active = true;
						window.activeTabId = message.tabId;
						return updatedWindows;
					});
					break;
				case "WINDOW_CREATED":
					setWindows(prevWindows => ({
						...prevWindows,
						[message.window.id]: message.window,
					}));
					break;
				case "WINDOW_DELETED":
					// TODO: Rewrite to avoid mutating prevWindows
					setWindows(prevWindows => {
						if (!prevWindows[message.windowId]) return prevWindows;
						delete prevWindows[message.windowId];
						return { ...prevWindows };
					});
					break;
			}
		}

		chrome.runtime.onMessage.addListener(onBrowserWindowEvent);

		chrome.runtime.sendMessage({ type: "GET_ALL_WINDOWS" }, response => setWindows(response));

		return () => chrome.runtime.onMessage.removeListener(onBrowserWindowEvent);
	}, []);

	return (
		<>
			<TabSearch query={query} setQuery={setQuery} />

			<div>
				<div>
					{queriedWindows.map(window => {
						const activeTab = windows[window.id].tabs[window.activeTabId];
						return (
							<Accordian
								key={window.id}
								title={
									<h2
										className={`${window.focused ? "text-yellow-300" : "bg-inherit"} ${window.incognito ? "bg-gray-500" : "bg-inherit"}`}
										title={`Window Id: ${window.id}`}
									>
										{activeTab ? activeTab.title : `Window ${window.id}`}
									</h2>
								}
							>
								<Window window={window} />
							</Accordian>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default TabList;
