Chrome Extension - URL Manager
A Chrome extension to manage URLs with functionalities like copying, opening URLs in new tabs, deleting, and storing them locally. This extension also features notifications for actions like copying or deleting URLs and provides a simple user interface for interacting with saved URLs.

Features
Copy URL to Clipboard: Single-click to copy a URL to the clipboard.
Open URL in New Tab: Double-click a URL to open it in a new tab.
Delete URL: Delete a URL from the list and local storage with a simple click on the trash icon.
Notifications: Get notified when a URL is copied or deleted.
Local Storage: All saved URLs are stored in the browser’s local storage for persistence across sessions.
Tech Stack
HTML: The structure and content of the extension.
CSS (TailwindCSS): Styling for the UI with a responsive and modern design.
JavaScript (Vanilla JS): Handling functionality and Chrome APIs.
Chrome Extensions API: For interacting with Chrome features like storage, notifications, and tabs.
React (Optional): If you have a React setup, you can integrate the extension into a React project.

Installation
Clone this repository to your local machine:

bash
Copy
Edit
git clone https://github.com/yourusername/your-repository-name.git
Open Chrome and navigate to the Extensions page (chrome://extensions/).

Enable Developer Mode in the top-right corner.

Click on Load unpacked and select the directory where the extension's files are located.

Your extension should now be installed and ready to use.

Usage
Once the extension is installed, it will:

Allow you to copy URLs by clicking a list item.
Double-click to open a URL in a new tab.
Click the trash icon next to a URL to delete it from your list and local storage.
Display notifications for copying or deleting URLs.

Contributing
Fork the repository.
Create a new branch (git checkout -b feature-name).
Make your changes.
Commit your changes (git commit -am 'Add feature').
Push to the branch (git push origin feature-name).
Create a new Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
