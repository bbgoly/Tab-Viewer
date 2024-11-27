function Window({ windowData }) {
	// TODO: Get localhost favicons working and implement switching user to tab if they click on the href (rather than it opening in a new tab)
	return (
		<div className="window">
			<h2 style={(windowData.focused && { color: "yellow" }) || (windowData.incognito && { backgroundColor: "grey" }) || undefined}>
				Window {windowData.id}
			</h2>
			<ul>
				{windowData.tabs.map(tab => (
					<li key={tab.id} style={tab.discarded ? { color: "gray" } : undefined}>
						{/* <Tab tabData={tab} /> */}
						<p>
							{<img src={tab.icon} title={new URL(tab.url).host} height={16} width={16} />}{" "}
							<strong title={tab.title}>{tab.title}</strong> - <a href={tab.url}>{tab.url}</a>
						</p>
						{tab.discarded && <p>Discarded</p>}
					</li>
				))}
			</ul>
		</div>
	);
}

export default Window;
