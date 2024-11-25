import { useState, useEffect, useMemo } from "react";

import Window from "./Window";
import TabSearch from "./TabSearch";

import useDebounce from "@/hooks/useDebounce";

function TabList() {
	const [windows, setWindows] = useState([]);

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query);

	const queriedWindows = useMemo(() => {
		return windows.map(window => ({
			...window,
			tabs: window.tabs.filter(tab => {
				if (!debouncedQuery) return true;

				const query = debouncedQuery.toLowerCase();
				return tab.title.toLowerCase().includes(query) || tab.url.toLowerCase().includes(query);
			}),
		}));
	}, [windows, debouncedQuery]);

	useEffect(() => chrome.runtime.sendMessage({ type: "GET_TABS" }, response => setWindows(response)), []);

	return (
		<>
			<TabSearch query={query} setQuery={setQuery} />

			<div className="tabList">
				<div className="windowList">
					{queriedWindows.map(window => (
						<Window key={window.id} windowData={window} />
					))}
				</div>
			</div>
		</>
	);
}

export default TabList;
