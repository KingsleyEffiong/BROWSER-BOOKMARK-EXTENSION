// Create the floating bookmark icon
const bookmark = document.createElement("div");
bookmark.id = "bookmark";
bookmark.style.position = "fixed";
bookmark.style.bottom = "15px";
bookmark.style.right = "15px";
bookmark.style.zIndex = "10000";
bookmark.style.fontSize = "30px";
bookmark.style.cursor = "pointer";
bookmark.style.background = "#180d1b";
bookmark.style.borderRadius = "50%";
bookmark.style.padding = "10px";
bookmark.style.display = "flex";
bookmark.style.alignItems = "center";
bookmark.style.justifyContent = "center";
bookmark.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
bookmark.style.transition = "all 0.3s ease-in-out";

// SVG Bookmark Icon
bookmark.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24">
    <path fill="white" d="M384 48H64c-17.7 0-32 14.3-32 32v400l192-112 192 112V80c0-17.7-14.3-32-32-32z"/>
  </svg>
`;

// Append icon to the page
document.body.appendChild(bookmark);

// === Create a stylish modal popup ===
const container = document.createElement("div");
container.id = "urlPopup";
container.style.position = "fixed";
container.style.bottom = "70px";
container.style.right = "15px";
container.style.width = "260px";
container.style.padding = "15px";
container.style.borderRadius = "12px";
container.style.backgroundColor = "#180d1b";
container.style.color = "white";
container.style.fontSize = "14px";
container.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
container.style.display = "none"; // Hidden by default
container.style.opacity = "0";
container.style.transition = "opacity 0.3s ease-in-out";

// Modal content
container.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <strong>Save this URL?</strong>
    <button id="closePopup" style="
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
    ">✖</button>
  </div>
  <p id="popupText" style="margin-top: 10px; word-break: break-word;">
    No URL yet
  </p>
<p id="url" style="visibility:hidden"></p>
  <button id="saveUrl" style="
    margin-top: 10px;
    width: 100%;
    padding: 8px;
    background-color: #fff;
    color: #180d1b;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
  "
  >Save URL</button>
`;

// Append popup to page
document.body.appendChild(container);

// === Event Listeners ===

// Show modal on bookmark click
bookmark.addEventListener("click", function () {
  container.style.display = "block";
  setTimeout(() => {
    container.style.opacity = "1";
  }, 50); // Smooth fade-in
});

// Close modal
document.getElementById("closePopup").addEventListener("click", function () {
  container.style.opacity = "0";
  setTimeout(() => {
    container.style.display = "none";
  }, 300);
});

// === Chrome Runtime Connection ===
const port = chrome.runtime.connect({ name: "urlBookmarker" });

port.onMessage.addListener((message) => {
  console.log("Received message via port:", message);
  if (message.type === "NEW_URL_VISITED") {
    document.getElementById("popupText").textContent = `${message.name.slice(
      0,
      25
    )}......`;
    // document.getElementById("url").textContent = `${message.url}`;
    // const url = message.url;
    container.style.display = "block";
    setTimeout(() => {
      container.style.opacity = "1";
    }, 50); // Smooth fade-in
  }
});

async function saveUrl() {
  const currentUrl = document.getElementById("popupText").textContent;
  if (!currentUrl) return;

  try {
    // Use the Promise version of chrome.storage.local.get
    const data = await chrome.storage.local.get("savedUrls");
    let urls = data.savedUrls || [];
    if (!urls.includes(currentUrl)) {
      urls.push(currentUrl);
      await chrome.storage.local.set({ savedUrls: urls });
      // setSavedUrl(urls);
      alert("Saved");
    }
  } catch (error) {
    console.error("Error saving URL:", error);
  }
}

// Handle URL saving
document.getElementById("saveUrl").addEventListener("click", function () {
  // alert("URL saved!"); // Replace with your actual save function
  saveUrl();
  container.style.opacity = "0";
  setTimeout(() => {
    container.style.display = "none";
  }, 300);
});
