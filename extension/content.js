// Content script - runs on Twitter/X pages

function getTweetData() {
  const url = window.location.href;

  // Check if we're on a tweet page
  const isTweetPage = /\/(status|tweet)\/\d+/.test(url);

  let mainTweet = '';
  let replies = '';
  let author = '';

  if (isTweetPage) {
    // We're on a single tweet page
    const articles = document.querySelectorAll('article[data-testid="tweet"]');

    if (articles.length > 0) {
      // First article is the main tweet
      const mainArticle = articles[0];
      mainTweet = extractTweetText(mainArticle);
      author = extractAuthor(mainArticle);

      // Rest are replies (grab up to 50 - Haiku will summarize them cheaply)
      const replyTexts = [];
      for (let i = 1; i < Math.min(articles.length, 51); i++) {
        const replyText = extractTweetText(articles[i]);
        const replyAuthor = extractAuthor(articles[i]);
        if (replyText) {
          replyTexts.push(`@${replyAuthor}: ${replyText}`);
        }
      }
      replies = replyTexts.join('\n\n');
    }
  } else {
    // We're on timeline - try to get the tweet under cursor or focused
    const hoveredTweet = document.querySelector('article[data-testid="tweet"]:hover');
    if (hoveredTweet) {
      mainTweet = extractTweetText(hoveredTweet);
      author = extractAuthor(hoveredTweet);
    }
  }

  return { mainTweet, replies, author, url };
}

function extractTweetText(article) {
  // Get the tweet text content
  const tweetTextElement = article.querySelector('[data-testid="tweetText"]');
  if (tweetTextElement) {
    return tweetTextElement.innerText.trim();
  }
  return '';
}

function extractAuthor(article) {
  // Try to get the author handle
  const userLinks = article.querySelectorAll('a[href^="/"]');
  for (const link of userLinks) {
    const href = link.getAttribute('href');
    if (href && href.match(/^\/[a-zA-Z0-9_]+$/) && !href.includes('/status')) {
      return href.slice(1); // Remove leading slash
    }
  }
  return 'unknown';
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTweetData') {
    const data = getTweetData();
    sendResponse(data);
  }
  return true;
});

// Also store data when user right-clicks (for context menu)
document.addEventListener('contextmenu', (e) => {
  const data = getTweetData();
  chrome.runtime.sendMessage({ action: 'storeTweetData', data });
}, true);
