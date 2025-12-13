const TWEETMINER_URL = 'https://tweetminer.vercel.app';

let tweetData = null;

document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const analyzeBtn = document.getElementById('analyzeBtn');

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if we're on Twitter/X
  const isTwitter = tab.url && (tab.url.includes('twitter.com') || tab.url.includes('x.com'));

  if (!isTwitter) {
    statusEl.textContent = 'Open a tweet on Twitter/X to analyze it';
    statusEl.className = 'status not-found';
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Not on Twitter';
    return;
  }

  // Try to get tweet data
  try {
    tweetData = await chrome.tabs.sendMessage(tab.id, { action: 'getTweetData' });

    if (tweetData && tweetData.mainTweet) {
      statusEl.textContent = 'Tweet found!';
      statusEl.className = 'status found';

      // Show preview
      const preview = tweetData.mainTweet.slice(0, 150);
      previewEl.textContent = preview + (tweetData.mainTweet.length > 150 ? '...' : '');
      previewEl.className = 'preview visible';

      analyzeBtn.textContent = 'Analyze This Tweet';
    } else {
      statusEl.textContent = 'Click on a tweet first, or open a tweet page';
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
  if (tweetData && tweetData.mainTweet) {
    const params = new URLSearchParams();
    params.set('tweet', tweetData.mainTweet);
    if (tweetData.replies) params.set('replies', tweetData.replies);
    if (tweetData.author) params.set('author', tweetData.author);
    if (tweetData.url) params.set('source', tweetData.url);

    chrome.tabs.create({ url: `${TWEETMINER_URL}?${params.toString()}` });
  } else {
    chrome.tabs.create({ url: TWEETMINER_URL });
  }
  window.close();
});
