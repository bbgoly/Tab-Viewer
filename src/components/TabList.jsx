import { useState, useEffect, useMemo } from "react";

import Window from "./Window";
import TabSearch from "./TabSearch";

import useDebounce from "@/hooks/useDebounce";

function TabList() {
	// use hashmap instead of array to perform two extra O(n) operations when
	// constructing the object in favor of instead of many O(n^2) operations when updating the array
	const [windows, setWindows] = useState({});

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query);

	const queriedWindows = useMemo(() => {
		return Object.values(windows).map(window => ({
			...window,
			tabs: Object.values(window.tabs).filter(tab => {
				if (!debouncedQuery) return true;

				const query = debouncedQuery.toLowerCase();
				return tab.title.toLowerCase().includes(query) || tab.url.toLowerCase().includes(query);
			}),
		}));
	}, [windows, debouncedQuery]);

	useEffect(() => {
		chrome.runtime.onMessage.addListener(message => {
			if (message.type === "TAB_UPDATE") {
				setWindows(prevWindows => {
					const updatedWindows = { ...prevWindows };
					if (updatedWindows[message.tab.windowId]) {
						updatedWindows[message.tab.windowId].tabs[message.tab.id] = message.tab;
					}
					return updatedWindows;
				});
			} else if (message.type === "TAB_DELETE") {
				setWindows(prevWindows => {
					const updatedWindows = { ...prevWindows };
					if (updatedWindows[message.windowId]) {
						delete updatedWindows[message.windowId].tabs[message.tabId];
					}
					return updatedWindows;
				});
			}
		});

		chrome.runtime.sendMessage({ type: "GET_ALL_WINDOWS" }, response => setWindows(response));
	}, []);

	return (
		<>
			<TabSearch query={query} setQuery={setQuery} />

			<div className="tabList">
				<div className="windowList">
					{queriedWindows.map(window => (
						<Window key={window.id} window={window} />
					))}
				</div>
			</div>
		</>
	);
}

export default TabList;
