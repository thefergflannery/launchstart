// A11YO Chrome Extension — Service Worker (Manifest V3)
// Minimal background script — token refresh happens in popup.js

chrome.runtime.onInstalled.addListener(() => {
  console.log('A11YO extension installed.');
});
