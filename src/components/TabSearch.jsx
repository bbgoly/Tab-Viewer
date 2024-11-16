import { useState } from "react"

function TabSearch() {
    const [query, setQuery] = useState("")

    // function onSubmit(e) {
    //     e.preventDefault()
    //     if (searchRef.current.value !== "") {
            
    //     }
    // }

    // learn about forms and hooks
    return (
        <>
            <form>
                <input value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder="Search for tabs..."/>
                <button type="submit">Search</button>
            </form>
            
            <div className="searchResults">

            </div>
        </>
    )
}

export default TabSearch