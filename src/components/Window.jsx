import Tab from "./Tab";

function Window({ windowData }) {
	return (
		<div className="window">
			<h2>Window {windowData.id}</h2>
			<ul>
				{windowData.tabs.map(tab => (
					<li key={tab.id}>
						<Tab tabData={tab} />
					</li>
				))}
			</ul>
		</div>
	);
}

export default Window;
