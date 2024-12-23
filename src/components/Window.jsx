import Tab from "./Tab";

function Window({ window }) {
	// TODO: Get localhost favicons working and implement switching user to tab if they click on the href (rather than it opening in a new tab)
	return (
		<div className="window-container">
			<h2 style={{ color: window.focused ? "yellow" : "inherit", backgroundColor: window.incognito ? "grey" : "inherit" }}>
				Window {window.id}
			</h2>
			<ul>
				{window.tabs.map(tab => (
					<li key={tab.id} style={tab.discarded ? { color: "gray" } : undefined}>
						<Tab tab={tab} />
					</li>
				))}
			</ul>
		</div>
	);
}

export default Window;
