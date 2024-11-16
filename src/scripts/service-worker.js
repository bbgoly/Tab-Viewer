chrome.runtime.onInstalled.addListener(() => chrome.tabs.query({}, (tabs) => console.log(tabs)))

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === "GET_TABS") {
        chrome.windows.getAll({ populate: true }, windows => {
            const windowsData = windows.map(window => ({
                id: window.id,
                tabs: window.tabs.map(tab => ({
                    id: tab.id,
                    title: tab.title,
                    url: tab.url,
                    icon: tab.favIconUrl
                }))
            }))
            sendResponse(windowsData)
        })
        return true
    }
})

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ active: false, url: "index.html" })
})

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })