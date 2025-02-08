import React, { useState, useEffect } from "react";
import backgroundImage from './assets/images/pexels-mohammad-danish-290641-891059.jpg';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function App() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState([]); // Correct state variable
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 5; // Number of items per page
  let timeout;
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const port = chrome.runtime.connect({ name: "urlBookmarker" });

    port.onMessage.addListener((message) => {
      console.log("Received message via port:", message);
      if (message.type === "NEW_URL_VISITED") {
        if (message.url === "chrome://extensions/") {
          setCurrentUrl('');
        } else {
          setCurrentUrl(message.name);
        }
      }
    });


    // Load saved URLs
    chrome.storage.local.get("savedUrls", (data) => {
      let urls = data.savedUrls || [];
      setSavedUrl(urls); // Corrected this line
    });
    setLoading(false)

    return () => port.disconnect();

  }, []);

  async function saveUrl() {
    if (!currentUrl) return;

    try {
      // Use the Promise version of chrome.storage.local.get
      const data = await chrome.storage.local.get("savedUrls");
      let urls = data.savedUrls || [];

      if (!urls.includes(currentUrl)) {
        urls.push(currentUrl);
        await chrome.storage.local.set({ savedUrls: urls });
        setSavedUrl(urls);
        chrome.notifications.create({
          type: "basic",
          iconUrl: "image/post 1.png",
          title: "Url Saced",
          message: "You have saved a url",
        });
      }
    } catch (error) {
      console.error("Error saving URL:", error);
    }
  }

  // Calculate the items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savedUrl.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCopy = (value) => {
    timeout = setTimeout(() => {
      navigator.clipboard.writeText(value)
        .then(() => {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "image/post 1.png",
            title: "Url Copied",
            message: "You have copied a url",
          });
          console.log("Copied to clipboard:", value);
        })
        .catch((err) => console.error("Failed to copy:", err));
    }, 250)
  };
  const handleOpenTab = (value) => {
    clearTimeout(timeout)
    window.open(value, "_blank"); // Opens URL in a new tab
  };

  const deleteUrl = async (url) => {
    try {
      const updatedUrls = savedUrl.filter((item) => item !== url);
      await chrome.storage.local.set({ savedUrls: updatedUrls });
      setSavedUrl(updatedUrls);
      chrome.notifications.create({
        type: "basic",
        iconUrl: "image/post 1.png",
        title: "Url Deleted",
        message: "You have deleted a url",
      });
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  }
  return (
    <div
      className="min-w-96 relative text-white py-4 px-3 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-lg"
        style={{ backgroundImage: `url(${backgroundImage})` }}>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-1">
        <img src="" alt="" />
        <h1 className="text-4xl font-bold headingFont mb-4">URLS EASY BOOKMARK</h1>
        <div className="w-full py-3 px-1 flex flex-row justify-between items-center">

          <p className="text-sm">{currentUrl ? `Current URL: ${currentUrl.slice(0, 15)}.....` : "No URL detected"}</p>
          {currentUrl && <button
            onClick={saveUrl}
            type="button"
            className="text-sm bg-[#180d1b] border-zinc-300 border-2 rounded-3xl py-2 px-5 w-auto cursor-pointer transition-all duration-300 ease-in-out hover:bg-transparent hover:text-white hover:border-white hover:scale-105"
          >
            Save Url
          </button>}
        </div>

        {/* Displaying saved URLs */}
        <h2 className="text-2xl text-left font-bold headingFont mb-4">{savedUrl.length === 0 ? '' : "YOUR SAVED URLS"}</h2>
        {loading && <p className="text-4xl text-red-800">Loading</p>}
        {savedUrl.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {currentItems.slice().reverse().map((url, index) => (
              <li
                key={index}
                onClick={() => handleCopy(url)}
                onDoubleClick={() => handleOpenTab(url)}
                className="text-sm bg-transparent border-zinc-300 border-2 rounded-3xl w-full py-2 px-5 flex justify-between items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#180d1b] hover:text-white hover:border-white hover:scale-105"
              >
                <span>
                  {url.slice(0, 27)} {`${url.length > 27 ? '.....' : ''}`}
                </span>

                <DeleteForeverIcon
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteUrl(url);
                  }}
                  className="cursor-pointer"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-left">No saved URLs yet.</p>
        )}
        {savedUrl.length > 5 && <Stack spacing={2}>
          <Pagination
            count={Math.ceil(savedUrl.length / itemsPerPage)} // Total number of pages
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            className="pt-3"
            sx={{
              '& .MuiPaginationItem-root': {
                backgroundColor: '#180d1b', // Change the background color
                color: 'white', // Change text color
                borderRadius: '50%', // Circular pagination buttons
              },
              '& .MuiPaginationItem-ellipsis': {
                color: 'white', // Style ellipsis dots
              },
              '& .Mui-selected': {
                backgroundColor: '#180d1b', // Change selected button background color
                color: 'white', // Change selected button text color
              },
            }}
          />
        </Stack>}
      </div>
    </div>
  );
}

export default App;
