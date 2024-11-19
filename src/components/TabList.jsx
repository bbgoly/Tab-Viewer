import { useState, useEffect } from "react"

import Window from "@/components/Window"

function TabList({ query }) {
    const [windows, setWindows] = useState([])

	useEffect(() => chrome.runtime.sendMessage({ type: "GET_TABS" }, response => setWindows(response)), [])

    return (
        <>
            <div className="tabList">
                <div className="windowList">
                    {windows.map(window => <Window key={window.id}></Window>)}
                </div>
                {windows.map(window => (
                    <div key={window.id}>
                        <h2>Window {window.id}</h2>
                        <ul>
                            {window.tabs.map(tab => (
                                <li key={tab.id}>
                                    <strong>{tab.title}</strong> - <a href={tab.url}>{tab.url}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )
}

export default TabList