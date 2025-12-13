// Background service worker

const TWEETMINER_URL = 'https://tweetminer.nolimitjones.com';

let storedData = null;

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'analyzeContent',
    title: 'Analyze with TweetMiner',
    contexts: ['page', 'selection'],
    documentUrlPatterns: [
      'https://twitter.com/*',
      'https://x.com/*',
      'https://www.reddit.com/*',
      'https://old.reddit.com/*',
      'https://www.linkedin.com/*',
      'https://news.ycombinator.com/*',
      'https://www.youtube.com/*'
    ]
  });
});

// Store data when user right-clicks
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeData') {
    storedData = request.data;
  }
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'analyzeContent') {
    // Try to get fresh data from content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getData' });
      if (response && response.mainContent) {
        openTweetMiner(response);
        return;
      }
    } catch (e) {
      console.log('Could not get data from content script');
    }

    // Fall back to stored data
    if (storedData && storedData.mainContent) {
      openTweetMiner(storedData);
    } else {
      // No data available - open TweetMiner anyway
      chrome.tabs.create({ url: TWEETMINER_URL });
    }
  }
});

function openTweetMiner(data) {
  const params = new URLSearchParams();

  if (data.mainContent) {
    params.set('tweet', data.mainContent);
  }
  if (data.replies) {
    params.set('replies', data.replies);
  }
  if (data.author) {
    params.set('author', data.author);
  }
  if (data.url) {
    params.set('source', data.url);
  }
  if (data.platform) {
    params.set('platform', data.platform);
  }

  const url = `${TWEETMINER_URL}?${params.toString()}`;
  chrome.tabs.create({ url });
}
