// Handle new tab updates and track visited URLs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    if (tab.url.startsWith("chrome://")) return; // Skip system pages

    chrome.storage.local.get("savedUrls", (data) => {
      const urls = data.savedUrls || [];

      if (urls.includes(tab.url)) return; // Avoid duplicate entries
      console.log("New URL Detected:", tab.url);

      // Send message to content script (if connected)
      chrome.runtime.sendMessage({
        type: "NEW_URL_VISITED",
        url: tab.url,
        name: tab.title,
      });
    });
  }
});

// Keep `onConnect` separate to avoid duplicate listeners
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "urlBookmarker") {
    console.log("New connection from content script");

    // Send the current active tab’s URL immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        port.postMessage({
          type: "NEW_URL_VISITED",
          url: tabs[0].url,
          name: tabs[0].title,
        });
      }
    });

    // Listen for tab updates and send URL changes
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        port.postMessage({
          type: "NEW_URL_VISITED",
          url: changeInfo.url,
          name: changeInfo.title,
        });
      }
    });
  }
});
