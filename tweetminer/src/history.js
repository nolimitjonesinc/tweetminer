// Past analyses, kept on this device only (localStorage). Nothing is sent anywhere.
export const HISTORY_KEY = 'tweetminer_history';
export const HISTORY_MAX = 20;

export function loadHistory(storage) {
  try {
    const raw = storage?.getItem(HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter(isEntry).slice(0, HISTORY_MAX) : [];
  } catch {
    return [];
  }
}

function isEntry(e) {
  return e && typeof e === 'object' && typeof e.id === 'string' &&
    typeof e.mode === 'string' && typeof e.tweetContent === 'string' &&
    typeof e.result === 'string';
}

// Newest first. The same tweet run through the same lens replaces its older copy.
export function addToHistory(list, { mode, tweetContent, topReplies = '', result }, now = Date.now()) {
  const entry = {
    id: `${now}-${mode}`,
    at: now,
    mode,
    tweetContent,
    topReplies,
    result,
  };
  const same = (e) => e.mode === mode && e.tweetContent.trim() === tweetContent.trim();
  return [entry, ...list.filter((e) => !same(e))].slice(0, HISTORY_MAX);
}

export function saveHistory(storage, list) {
  try {
    storage?.setItem(HISTORY_KEY, JSON.stringify(list));
    return true;
  } catch {
    // Storage full or blocked (private window): history just isn't kept.
    return false;
  }
}

export function excerpt(text, max = 80) {
  const one = String(text || '').replace(/\s+/g, ' ').trim();
  return one.length > max ? one.slice(0, max - 1).trimEnd() + '…' : one;
}

export function timeAgo(at, now = Date.now()) {
  const mins = Math.max(0, Math.floor((now - at) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

// For pasting into notes or a doc: heading, the tweet as a quote, then the analysis.
export function toMarkdown({ label, tweetContent, result }) {
  const quoted = String(tweetContent || '').trim().split('\n').map((l) => `> ${l}`).join('\n');
  return `## ${label} analysis\n\n${quoted}\n\n${String(result || '').trim()}\n`;
}
