function TabSearch({ query, setQuery }) {
	// learn about forms and hooks
	return (
		<>
			<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for tabs..." autoFocus />
		</>
	);
}

export default TabSearch;
