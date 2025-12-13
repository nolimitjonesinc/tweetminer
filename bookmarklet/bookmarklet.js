// TweetMiner Bookmarklet
// This gets minified and turned into a bookmarklet URL

(function() {
  const TWEETMINER_URL = 'https://tweetminer.nolimitjones.com';

  function detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('reddit.com')) return 'reddit';
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('ycombinator.com')) return 'hackernews';
    if (hostname.includes('youtube.com')) return 'youtube';
    return 'other';
  }

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
        const tweetText = mainArticle.querySelector('[data-testid="tweetText"]');
        mainContent = tweetText ? tweetText.innerText.trim() : '';

        const userLinks = mainArticle.querySelectorAll('a[href^="/"]');
        for (const link of userLinks) {
          const href = link.getAttribute('href');
          if (href && href.match(/^\/[a-zA-Z0-9_]+$/) && !href.includes('/status')) {
            author = href.slice(1);
            break;
          }
        }

        const replyTexts = [];
        for (let i = 1; i < Math.min(articles.length, 51); i++) {
          const replyText = articles[i].querySelector('[data-testid="tweetText"]');
          if (replyText) {
            replyTexts.push(replyText.innerText.trim());
          }
        }
        replies = replyTexts.join('\n\n');
      }
    }
    return { mainContent, replies, author, url, platform: 'twitter' };
  }

  function getRedditData() {
    const url = window.location.href;
    let mainContent = '';
    let replies = '';
    let author = '';

    if (document.querySelector('shreddit-post')) {
      const post = document.querySelector('shreddit-post');
      const titleEl = post?.querySelector('h1') || document.querySelector('h1');
      const bodyEl = document.querySelector('[slot="text-body"]') || document.querySelector('[data-click-id="text"]');
      author = post?.getAttribute('author') || 'unknown';
      mainContent = (titleEl?.innerText || '') + '\n\n' + (bodyEl?.innerText || '');

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
    } else if (document.querySelector('.thing.link')) {
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

  function getLinkedInData() {
    const url = window.location.href;
    let mainContent = '';
    let replies = '';
    let author = '';

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

    const comments = document.querySelectorAll('.comments-comment-item');
    const commentTexts = [];
    comments.forEach((comment, i) => {
      if (i >= 50) return;
      const commentAuthor = comment.querySelector('.comments-post-meta__name-text')?.innerText || 'unknown';
      const commentText = comment.querySelector('.comments-comment-item__main-content')?.innerText || '';
      if (commentText.trim()) {
        commentTexts.push(`${commentAuthor.trim()}: ${commentText.trim()}`);
      }
    });
    replies = commentTexts.join('\n\n');

    return { mainContent, replies, author, url, platform: 'linkedin' };
  }

  function getHackerNewsData() {
    const url = window.location.href;
    let mainContent = '';
    let replies = '';
    let author = '';

    const titleEl = document.querySelector('.titleline > a');
    const title = titleEl?.innerText || '';
    const toptext = document.querySelector('.toptext')?.innerText || '';
    author = document.querySelector('.hnuser')?.innerText || 'unknown';
    mainContent = title + (toptext ? '\n\n' + toptext : '');

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

  function getYouTubeData() {
    const url = window.location.href;
    let mainContent = '';
    let replies = '';
    let author = '';

    const titleEl = document.querySelector('h1.ytd-video-primary-info-renderer') ||
                    document.querySelector('h1.title');
    const title = titleEl?.innerText || '';

    const channelEl = document.querySelector('#channel-name a') ||
                      document.querySelector('ytd-channel-name a');
    author = channelEl?.innerText || 'unknown';

    const descEl = document.querySelector('#description-inline-expander') ||
                   document.querySelector('ytd-text-inline-expander') ||
                   document.querySelector('#description');
    const description = descEl?.innerText || '';

    mainContent = `${title}\n\nBy: ${author}\n\n${description}`;

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

  function getGenericData() {
    const url = window.location.href;
    const selection = window.getSelection().toString();
    let mainContent = selection || '';

    if (!mainContent) {
      const article = document.querySelector('article');
      if (article) {
        mainContent = article.innerText.slice(0, 5000);
      } else {
        const h1 = document.querySelector('h1');
        if (h1) {
          mainContent = h1.innerText;
        }
      }
    }

    return { mainContent, replies: '', author: '', url, platform: 'other' };
  }

  function getData() {
    const platform = detectPlatform();
    switch (platform) {
      case 'twitter': return getTwitterData();
      case 'reddit': return getRedditData();
      case 'linkedin': return getLinkedInData();
      case 'hackernews': return getHackerNewsData();
      case 'youtube': return getYouTubeData();
      default: return getGenericData();
    }
  }

  // Main execution
  const data = getData();

  if (!data.mainContent) {
    alert('TweetMiner: No content found. Try selecting some text first.');
    return;
  }

  const params = new URLSearchParams();
  if (data.mainContent) params.set('tweet', data.mainContent);
  if (data.replies) params.set('replies', data.replies);
  if (data.author) params.set('author', data.author);
  if (data.url) params.set('source', data.url);
  if (data.platform) params.set('platform', data.platform);

  window.open(`${TWEETMINER_URL}?${params.toString()}`, '_blank');
})();
