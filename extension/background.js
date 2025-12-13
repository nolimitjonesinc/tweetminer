// Background service worker

const TWEETMINER_URL = 'https://tweetminer.nolimitjones.com';

let storedTweetData = null;

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'analyzeTweet',
    title: 'Analyze with TweetMiner',
    contexts: ['page', 'selection'],
    documentUrlPatterns: ['https://twitter.com/*', 'https://x.com/*']
  });
});

// Store tweet data when user right-clicks
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeTweetData') {
    storedTweetData = request.data;
  }
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'analyzeTweet') {
    // Try to get fresh data from content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getTweetData' });
      if (response && response.mainTweet) {
        openTweetMiner(response);
        return;
      }
    } catch (e) {
      console.log('Could not get tweet data from content script');
    }

    // Fall back to stored data
    if (storedTweetData && storedTweetData.mainTweet) {
      openTweetMiner(storedTweetData);
    } else {
      // No data available - open TweetMiner anyway
      chrome.tabs.create({ url: TWEETMINER_URL });
    }
  }
});

function openTweetMiner(data) {
  const params = new URLSearchParams();

  if (data.mainTweet) {
    params.set('tweet', data.mainTweet);
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

  const url = `${TWEETMINER_URL}?${params.toString()}`;
  chrome.tabs.create({ url });
}
