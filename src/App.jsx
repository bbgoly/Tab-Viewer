import { useState } from "react"

import TabSearch from "@/components/TabSearch"
import TabList from "@/components/TabList"

import useDebounce from "@/hooks/useDebounce"

function App() {
	const [query, setQuery] = useState("")
	const debouncedQuery = useDebounce(query, 1000)

	return (
		<>
			<h1>Tab Viewer</h1>
			<TabSearch query={query} setQuery={setQuery} />
			<TabList query={debouncedQuery} />
		</>
	)
}

export default App
