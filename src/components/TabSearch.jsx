import { useState } from "react"

function SearchView({ query }) {
    return (
        <div className="resultsView">
            
        </div>
    )
}

function TabSearch({ windows }) {
    const [query, setQuery] = useState("")

    // function onSubmit(e) {
    //     e.preventDefault()
    //     if (searchRef.current.value !== "") {
            
    //     }
    // }

    // learn about forms and hooks
    return (
        <>
            {/* <form> */}
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for tabs..."/>
                {/* <button type="submit">Search</button> */}
            {/* </form> */}

            {query.length > 0 && <SearchView/>}
        </>
    )
}

export default TabSearch