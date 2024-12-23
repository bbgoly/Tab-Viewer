function Tab({ tab }) {
	const parsedUrl = new URL(tab.url);
	return (
		<div className="tab-container">
			<p>
				<img src={tab.icon} title={parsedUrl.host} height={16} width={16} />
				<a href={tab.url}>
					<strong title={tab.title}>{tab.title}</strong>
				</a>
				{tab.discarded && <p>Discarded</p>}
			</p>
			<p>
				{<img src={tab.icon} title={new URL(tab.url).host} height={16} width={16} />}{" "}
				<a href={tab.url}>
					<strong title={tab.title}>{tab.title}</strong>
				</a>
			</p>
			{tab.discarded && <p>Discarded</p>}
		</div>
	);
}

export default Tab;
