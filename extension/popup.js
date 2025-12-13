const TWEETMINER_URL = 'https://tweetminer.nolimitjones.com';

const PLATFORM_NAMES = {
  twitter: 'Twitter/X',
  reddit: 'Reddit',
  linkedin: 'LinkedIn',
  hackernews: 'Hacker News',
  youtube: 'YouTube',
  other: 'this page'
};

let contentData = null;

document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const analyzeBtn = document.getElementById('analyzeBtn');

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if we're on a supported platform
  const url = tab.url || '';
  const isSupported = url.includes('twitter.com') ||
                      url.includes('x.com') ||
                      url.includes('reddit.com') ||
                      url.includes('linkedin.com') ||
                      url.includes('ycombinator.com') ||
                      url.includes('youtube.com');

  if (!isSupported) {
    statusEl.textContent = 'Open a post on Twitter, Reddit, LinkedIn, HN, or YouTube';
    statusEl.className = 'status not-found';
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Not on supported site';
    return;
  }

  // Try to get content data
  try {
    contentData = await chrome.tabs.sendMessage(tab.id, { action: 'getData' });

    if (contentData && contentData.mainContent) {
      const platformName = PLATFORM_NAMES[contentData.platform] || 'this page';
      statusEl.textContent = `Content found on ${platformName}!`;
      statusEl.className = 'status found';

      // Show preview
      const preview = contentData.mainContent.slice(0, 150);
      previewEl.textContent = preview + (contentData.mainContent.length > 150 ? '...' : '');
      previewEl.className = 'preview visible';

      analyzeBtn.textContent = 'Analyze This Content';
    } else {
      statusEl.textContent = 'Navigate to a post to analyze it';
      statusEl.className = 'status not-found';
      analyzeBtn.textContent = 'Open TweetMiner';
    }
  } catch (e) {
    statusEl.textContent = 'Refresh the page and try again';
    statusEl.className = 'status not-found';
    analyzeBtn.textContent = 'Open TweetMiner';
  }
});

document.getElementById('analyzeBtn').addEventListener('click', () => {
  if (contentData && contentData.mainContent) {
    const params = new URLSearchParams();
    params.set('tweet', contentData.mainContent);
    if (contentData.replies) params.set('replies', contentData.replies);
    if (contentData.author) params.set('author', contentData.author);
    if (contentData.url) params.set('source', contentData.url);
    if (contentData.platform) params.set('platform', contentData.platform);

    chrome.tabs.create({ url: `${TWEETMINER_URL}?${params.toString()}` });
  } else {
    chrome.tabs.create({ url: TWEETMINER_URL });
  }
  window.close();
});
