chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    if (tab.url.startsWith("chrome://")) return; // Skip system pages

    try {
      // Use await to retrieve stored URLs
      const data = await chrome.storage.local.get("savedUrls");
      const urls = data.savedUrls || [];
      if (!urls.length) {
        console.log("No saved URLs found, but continuing...");
      }
      if (urls.includes(tab.url)) return;
      // Open popup action
      chrome.action.openPopup();
      // Show a notification
      // chrome.notifications.create({
      //   type: "basic",
      //   iconUrl: "image/post 1.png",
      //   title: "New URL Visited",
      //   message: "Do you want to add this URL to your bookmarks?",
      // });

      // Send URL to popup (Keep the listener outside event handlers in MV3)
      chrome.runtime.onConnect.addListener((port) => {
        if (port.name === "urlBookmarker") {
          port.postMessage({ type: "NEW_URL_VISITED", url: tab.url });
        }
      });
    } catch (error) {
      console.error("Error retrieving storage:", error);
    }
  }
});
