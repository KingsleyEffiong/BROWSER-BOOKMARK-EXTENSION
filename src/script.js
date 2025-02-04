console.log("Content script loaded!");
chrome.runtime.sendMessage({ action: "TEST_POPUP" }, (response) => {
  console.log("Response from background:", response);
});
