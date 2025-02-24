import TabList from "@/components/TabList";

function App() {
	// dont forget isFirefox ? : for about vs. extensions and other browser-dependent technicalities

	// convert the tip to use accordion dropdown with numbered steps
	// use smaller font, italics, and grayer text
	// also, try to look for an event to listen to that triggers when extension is now allowed to work in incognito

	// maybe listen to the installed event and check if context is incognito
	// (and if it is, then send a message to App to hide the "Tip", which would then cause a re-render of TabList to automatically query incognito tabs 👍)

	/* (> refers to accordion dropdown icon)
	 * > Tip: How to also list tabs from incognito windows
	 *		If you want to also view your tabs across each of your incognito windows, {browserName} requires you to allow the extension to access incognito windows through these steps:
	 *		(small line break)
	 *		1. Visit <a href={extensionDetailsURL}>{extensionDetailsURL}</a> (You may have to copy it and visit the page manually)
	 *		2. Locate the &quot;Tab Viewer&quot; extension under &quot;All Extensions&quot; and click on &quot;Details&quot;
	 *		3. Locate and enable &quot;Allow in Private&quot; in the list of settings that appear
	 */

	const extensionDetailsURL = `chrome://extensions?id=${chrome.runtime.id}`;
	return (
		<>
			<h1>Tab Viewer</h1>
			<p>
				Tip: If you want todd also view your tabs across your incognito windows, visit{" "}
				<a href={extensionDetailsURL}>{extensionDetailsURL}</a>, then click on the &quot;Details&quot; button under &quot;Tab
				Viewer&quot;, and enable &quot;Allow in Private&quot;
			</p>
			<TabList />
		</>
	);
}

export default App;
