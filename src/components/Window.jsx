import Tab from "./Tab";

function Window({ window }) {
	// TODO: Get localhost favicons working and implement switching user to tab if they click on the href (rather than it opening in a new tab)
	// TODO: Properly design window container and tab items, color the background differently depending on whether its the active tab or an incognito tab (make the color the same as that browser's incognito background color)
	return (
		<div className="window-container">
			<ul>
				{window.tabs?.map(tab => (
					<li key={tab.id} style={tab.discarded ? { color: "gray" } : undefined}>
						<Tab tab={tab} />
					</li>
				))}
			</ul>
		</div>
	);
}

export default Window;
