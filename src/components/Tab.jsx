function Tab({ tabData }) {
	return (
		<>
			<strong>{tabData.title}</strong> - <a href={tabData.url}>{tabData.url}</a>
		</>
	);
}

export default Tab;
