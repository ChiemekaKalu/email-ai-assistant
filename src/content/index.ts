import { getEmails } from './gmail';

// Initialize content script
function init() {
  console.log('Email AI Assistant: Content script initialized');
  setupEmailObserver();
}

// Set up observer to detect when new emails are loaded
function setupEmailObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        handleNewEmails();
      }
    }
  });

  // Start observing Gmail's main content area
  const gmailContent = document.querySelector('[role="main"]');
  if (gmailContent) {
    observer.observe(gmailContent, {
      childList: true,
      subtree: true,
    });
  }
}

// Handle new emails being loaded
async function handleNewEmails() {
  const emails = await getEmails();
  if (emails.length > 0) {
    chrome.runtime.sendMessage({
      type: 'NEW_EMAILS',
      payload: emails,
    });
  }
}

// Start the content script
init();
