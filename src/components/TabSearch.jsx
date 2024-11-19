function TabSearch({ query, setQuery }) {
    // function onSubmit(e) {
    //     e.preventDefault()
    //     if (searchRef.current.value !== "") {
            
    //     }
    // }

    // learn about forms and hooks
    return (
        <>
            {/* <form> */}
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for tabs..." autoFocus/>
                {/* <button type="submit">Search</button> */}
            {/* </form> */}
        </>
    )
}

export default TabSearch