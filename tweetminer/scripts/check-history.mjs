import assert from 'node:assert/strict';
import { loadHistory, addToHistory, saveHistory, excerpt, timeAgo, toMarkdown, HISTORY_KEY, HISTORY_MAX } from '../src/history.js';

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log('ok -', name); };
const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), m }; };

t('empty storage gives empty list', () => assert.deepEqual(loadHistory(mem()), []));
t('garbage JSON gives empty list', () => { const s = mem(); s.setItem(HISTORY_KEY, '{nope'); assert.deepEqual(loadHistory(s), []); });
t('non-array gives empty list', () => { const s = mem(); s.setItem(HISTORY_KEY, '{"a":1}'); assert.deepEqual(loadHistory(s), []); });
t('bad entries are dropped', () => { const s = mem(); s.setItem(HISTORY_KEY, JSON.stringify([{ id: 'x' }, null, { id: '1', mode: 'exploit', tweetContent: 'a', result: 'b' }])); assert.equal(loadHistory(s).length, 1); });
t('newest first', () => { let l = addToHistory([], { mode: 'exploit', tweetContent: 'a', result: 'r1' }, 1); l = addToHistory(l, { mode: 'explain', tweetContent: 'b', result: 'r2' }, 2); assert.equal(l[0].tweetContent, 'b'); });
t('same tweet + same lens replaces older', () => { let l = addToHistory([], { mode: 'exploit', tweetContent: 'a ', result: 'old' }, 1); l = addToHistory(l, { mode: 'exploit', tweetContent: 'a', result: 'new' }, 2); assert.equal(l.length, 1); assert.equal(l[0].result, 'new'); });
t('same tweet, other lens keeps both', () => { let l = addToHistory([], { mode: 'exploit', tweetContent: 'a', result: 'x' }, 1); l = addToHistory(l, { mode: 'productize', tweetContent: 'a', result: 'y' }, 2); assert.equal(l.length, 2); });
t('capped at max', () => { let l = []; for (let i = 0; i < HISTORY_MAX + 5; i++) l = addToHistory(l, { mode: 'exploit', tweetContent: 't' + i, result: 'r' }, i); assert.equal(l.length, HISTORY_MAX); assert.equal(l[0].tweetContent, 't' + (HISTORY_MAX + 4)); });
t('save then load round-trips', () => { const s = mem(); const l = addToHistory([], { mode: 'exploit', tweetContent: 'a', topReplies: 'r', result: 'x' }, 5); assert.equal(saveHistory(s, l), true); assert.deepEqual(loadHistory(s), l); });
t('save survives a full/blocked storage', () => { assert.equal(saveHistory({ setItem() { throw new Error('quota'); } }, []), false); });
t('excerpt collapses and trims', () => { assert.equal(excerpt('a\n\n b', 80), 'a b'); assert.equal(excerpt('x'.repeat(100), 10).length, 10); });
t('timeAgo', () => { assert.equal(timeAgo(0, 30000), 'just now'); assert.equal(timeAgo(0, 5 * 60000), '5m ago'); assert.equal(timeAgo(0, 3 * 3600000), '3h ago'); assert.equal(timeAgo(0, 50 * 3600000), '2d ago'); });
t('markdown quotes every tweet line', () => { const md = toMarkdown({ label: 'EXPLOIT', tweetContent: 'line one\nline two', result: 'Do X.' }); assert.equal(md, '## EXPLOIT analysis\n\n> line one\n> line two\n\nDo X.\n'); });

console.log(`\n${pass}/13 passed`);
