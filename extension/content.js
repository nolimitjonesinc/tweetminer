// Content script - runs on supported platforms
// Detects platform and extracts content accordingly

function detectPlatform() {
  const hostname = window.location.hostname;
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
  if (hostname.includes('reddit.com')) return 'reddit';
  if (hostname.includes('linkedin.com')) return 'linkedin';
  if (hostname.includes('ycombinator.com')) return 'hackernews';
  if (hostname.includes('youtube.com')) return 'youtube';
  return 'other';
}

// ============ TWITTER/X ============
function getTwitterData() {
  const url = window.location.href;
  const isTweetPage = /\/(status|tweet)\/\d+/.test(url);

  let mainContent = '';
  let replies = '';
  let author = '';

  if (isTweetPage) {
    const articles = document.querySelectorAll('article[data-testid="tweet"]');

    if (articles.length > 0) {
      const mainArticle = articles[0];
      mainContent = extractTwitterText(mainArticle);
      author = extractTwitterAuthor(mainArticle);

      const replyTexts = [];
      for (let i = 1; i < Math.min(articles.length, 51); i++) {
        const replyText = extractTwitterText(articles[i]);
        const replyAuthor = extractTwitterAuthor(articles[i]);
        if (replyText) {
          replyTexts.push(`@${replyAuthor}: ${replyText}`);
        }
      }
      replies = replyTexts.join('\n\n');
    }
  } else {
    const hoveredTweet = document.querySelector('article[data-testid="tweet"]:hover');
    if (hoveredTweet) {
      mainContent = extractTwitterText(hoveredTweet);
      author = extractTwitterAuthor(hoveredTweet);
    }
  }

  return { mainContent, replies, author, url, platform: 'twitter' };
}

function extractTwitterText(article) {
  const tweetTextElement = article.querySelector('[data-testid="tweetText"]');
  return tweetTextElement ? tweetTextElement.innerText.trim() : '';
}

function extractTwitterAuthor(article) {
  const userLinks = article.querySelectorAll('a[href^="/"]');
  for (const link of userLinks) {
    const href = link.getAttribute('href');
    if (href && href.match(/^\/[a-zA-Z0-9_]+$/) && !href.includes('/status')) {
      return href.slice(1);
    }
  }
  return 'unknown';
}

// ============ REDDIT ============
function getRedditData() {
  const url = window.location.href;
  let mainContent = '';
  let replies = '';
  let author = '';

  // New Reddit
  if (document.querySelector('shreddit-post')) {
    const post = document.querySelector('shreddit-post');
    const titleEl = post?.querySelector('h1') || document.querySelector('h1');
    const bodyEl = document.querySelector('[slot="text-body"]') || document.querySelector('[data-click-id="text"]');

    author = post?.getAttribute('author') || 'unknown';
    mainContent = (titleEl?.innerText || '') + '\n\n' + (bodyEl?.innerText || '');

    // Get comments
    const comments = document.querySelectorAll('shreddit-comment');
    const commentTexts = [];
    for (let i = 0; i < Math.min(comments.length, 50); i++) {
      const comment = comments[i];
      const commentAuthor = comment.getAttribute('author') || 'unknown';
      const commentBody = comment.querySelector('[slot="comment"]')?.innerText || '';
      if (commentBody.trim()) {
        commentTexts.push(`u/${commentAuthor}: ${commentBody.trim()}`);
      }
    }
    replies = commentTexts.join('\n\n');
  }
  // Old Reddit
  else if (document.querySelector('.thing.link')) {
    const post = document.querySelector('.thing.link');
    const title = document.querySelector('a.title')?.innerText || '';
    const selftext = document.querySelector('.usertext-body')?.innerText || '';
    author = document.querySelector('.author')?.innerText || 'unknown';
    mainContent = title + '\n\n' + selftext;

    const comments = document.querySelectorAll('.comment .usertext-body');
    const commentAuthors = document.querySelectorAll('.comment .author');
    const commentTexts = [];
    for (let i = 0; i < Math.min(comments.length, 50); i++) {
      const commentText = comments[i]?.innerText || '';
      const commentAuthor = commentAuthors[i]?.innerText || 'unknown';
      if (commentText.trim()) {
        commentTexts.push(`u/${commentAuthor}: ${commentText.trim()}`);
      }
    }
    replies = commentTexts.join('\n\n');
  }

  return { mainContent: mainContent.trim(), replies, author, url, platform: 'reddit' };
}

// ============ LINKEDIN ============
function getLinkedInData() {
  const url = window.location.href;
  let mainContent = '';
  let replies = '';
  let author = '';

  // Post content
  const postContainer = document.querySelector('.feed-shared-update-v2') ||
                        document.querySelector('[data-urn]') ||
                        document.querySelector('.share-update-card');

  if (postContainer) {
    const authorEl = postContainer.querySelector('.update-components-actor__name') ||
                     postContainer.querySelector('.feed-shared-actor__name');
    author = authorEl?.innerText?.trim() || 'unknown';

    const textEl = postContainer.querySelector('.feed-shared-update-v2__description') ||
                   postContainer.querySelector('.feed-shared-text') ||
                   postContainer.querySelector('.break-words');
    mainContent = textEl?.innerText?.trim() || '';
  }

  // Comments
  const comments = document.querySelectorAll('.comments-comment-item') ||
                   document.querySelectorAll('[data-id^="urn:li:comment"]');
  const commentTexts = [];
  comments.forEach((comment, i) => {
    if (i >= 50) return;
    const commentAuthor = comment.querySelector('.comments-post-meta__name-text')?.innerText ||
                          comment.querySelector('.comment-item__inline-show-more-text')?.innerText || 'unknown';
    const commentText = comment.querySelector('.comments-comment-item__main-content')?.innerText ||
                        comment.querySelector('.feed-shared-text')?.innerText || '';
    if (commentText.trim()) {
      commentTexts.push(`${commentAuthor.trim()}: ${commentText.trim()}`);
    }
  });
  replies = commentTexts.join('\n\n');

  return { mainContent, replies, author, url, platform: 'linkedin' };
}

// ============ HACKER NEWS ============
function getHackerNewsData() {
  const url = window.location.href;
  let mainContent = '';
  let replies = '';
  let author = '';

  // Main post
  const titleEl = document.querySelector('.titleline > a');
  const title = titleEl?.innerText || '';

  // Check if there's a text post (self post)
  const toptext = document.querySelector('.toptext')?.innerText || '';

  const authorEl = document.querySelector('.hnuser');
  author = authorEl?.innerText || 'unknown';

  mainContent = title + (toptext ? '\n\n' + toptext : '');

  // Comments
  const comments = document.querySelectorAll('.comtr');
  const commentTexts = [];
  for (let i = 0; i < Math.min(comments.length, 50); i++) {
    const comment = comments[i];
    const commentAuthor = comment.querySelector('.hnuser')?.innerText || 'unknown';
    const commentText = comment.querySelector('.commtext')?.innerText || '';
    if (commentText.trim()) {
      commentTexts.push(`${commentAuthor}: ${commentText.trim()}`);
    }
  }
  replies = commentTexts.join('\n\n');

  return { mainContent, replies, author, url, platform: 'hackernews' };
}

// ============ YOUTUBE ============
function getYouTubeData() {
  const url = window.location.href;
  let mainContent = '';
  let replies = '';
  let author = '';

  // Video title
  const titleEl = document.querySelector('h1.ytd-video-primary-info-renderer') ||
                  document.querySelector('h1.title');
  const title = titleEl?.innerText || '';

  // Channel name
  const channelEl = document.querySelector('#channel-name a') ||
                    document.querySelector('ytd-channel-name a');
  author = channelEl?.innerText || 'unknown';

  // Description
  const descEl = document.querySelector('#description-inline-expander') ||
                 document.querySelector('ytd-text-inline-expander') ||
                 document.querySelector('#description');
  const description = descEl?.innerText || '';

  mainContent = `${title}\n\nBy: ${author}\n\n${description}`;

  // Comments
  const comments = document.querySelectorAll('ytd-comment-thread-renderer');
  const commentTexts = [];
  for (let i = 0; i < Math.min(comments.length, 50); i++) {
    const comment = comments[i];
    const commentAuthor = comment.querySelector('#author-text')?.innerText?.trim() || 'unknown';
    const commentText = comment.querySelector('#content-text')?.innerText || '';
    if (commentText.trim()) {
      commentTexts.push(`${commentAuthor}: ${commentText.trim()}`);
    }
  }
  replies = commentTexts.join('\n\n');

  return { mainContent, replies, author, url, platform: 'youtube' };
}

// ============ MAIN ============
function getData() {
  const platform = detectPlatform();

  switch (platform) {
    case 'twitter':
      return getTwitterData();
    case 'reddit':
      return getRedditData();
    case 'linkedin':
      return getLinkedInData();
    case 'hackernews':
      return getHackerNewsData();
    case 'youtube':
      return getYouTubeData();
    default:
      return { mainContent: '', replies: '', author: '', url: window.location.href, platform: 'other' };
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getData') {
    const data = getData();
    sendResponse(data);
  }
  return true;
});

// Store data when user right-clicks (for context menu)
document.addEventListener('contextmenu', (e) => {
  const data = getData();
  chrome.runtime.sendMessage({ action: 'storeData', data });
}, true);
