console.log('[Azure Syntax Highlighter] Background service worker started')

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Azure Syntax Highlighter] Extension installed')
    // Set default settings on install
    chrome.storage.sync.set({
      settings: {
        enabled: true,
        theme: 'auto',
      },
    })
  }
})

// Handle messages from popup or content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['settings'], (result) => {
      sendResponse(result.settings || { enabled: true, theme: 'auto' })
    })
    return true // Keep message channel open for async response
  }

  if (request.type === 'SETTINGS_UPDATED') {
    console.log('[Azure Syntax Highlighter] Settings updated:', request.settings)
  }
})
