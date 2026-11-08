// Mine Replies: sort replies into compliments / frustrations / better ideas,
// score each for sellable value, and save ONLY the valuable ones (score 4-5).
import { createHash } from 'crypto';
import { callClaude, isAuthed, db, supabaseConfigured } from './_lib.js';
import { PORTFOLIO } from './_portfolio.js';

const MIN_SCORE = 4; // only replies worth money get saved

const SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          handle: { type: 'string' },
          quote: { type: 'string' },
          bucket: { type: 'string', enum: ['compliment', 'frustration', 'idea'] },
          value_score: { type: 'integer', enum: [1, 2, 3, 4, 5] },
          sellable_fix: { type: 'string' },
          existing_app: { type: 'string' },
          who_pays: { type: 'string' },
          draft_reply: { type: 'string' },
        },
        required: ['handle', 'quote', 'bucket', 'value_score', 'sellable_fix', 'existing_app', 'who_pays', 'draft_reply'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

function systemPrompt(profile) {
  const name = profile?.name || 'the user';
  return `You mine social-media replies for things ${name} can build fast and sell.
${name} is: ${profile?.role || 'a solo builder'}. Skills: ${profile?.skills || 'AI app building'}. Constraints: ${profile?.constraints || 'solo, small budget'}.

${name} already has these finished apps and services:
${PORTFOLIO.map((p) => `- ${p}`).join('\n')}

For EVERY reply that is a compliment, a frustration, or a better idea, output one item:
- handle: the replier's handle exactly as given (e.g. "@jane"). Use "unknown" if none was given. Never invent one.
- quote: their exact words, trimmed to the key sentence. Never paraphrase.
- bucket: "compliment" (proof people want it), "frustration" (a gap or pain), or "idea" (a better version or upgrade).
- value_score: how much money is in this for ${name}:
  5 = a specific person with a clear, painful problem ${name} could fix and sell within weeks, or one of the apps above already fixes it
  4 = a real, specific need with likely buyers, buildable fast
  3 = interesting but vague, or slow/expensive to build
  2 = generic praise or venting with nothing to sell
  1 = noise, jokes, spam
  Be strict. Most replies are 1-3.
- sellable_fix: one sentence: the quick thing to build or offer.
- existing_app: the exact name of the matching app above, or "" if none fits.
- who_pays: who would pay for it, one short phrase.
- draft_reply: a short, friendly, non-spammy public reply to that person (under 280 characters). Helpful first; mention the app only if it truly fits.

Skip replies that are none of the three buckets.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, tweetContent, topReplies, profile, platform, sourceUrl } = req.body || {};
  if (!isAuthed(token)) return res.status(401).json({ error: 'Please log in again.' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  if (!topReplies || !topReplies.trim()) {
    return res.status(400).json({ error: 'Mine Replies needs replies. Paste some, or capture with the extension.' });
  }

  try {
    const text = await callClaude(
      apiKey,
      'claude-sonnet-5-5',
      systemPrompt(profile),
      `ORIGINAL POST (${platform || 'other'}):\n${tweetContent || '(not provided)'}\n\nREPLIES:\n${topReplies}`,
      32000,
      { format: { type: 'json_schema', schema: SCHEMA } }
    );

    const all = JSON.parse(text).items || [];
    const keepers = all
      .filter((i) => i.value_score >= MIN_SCORE)
      .sort((a, b) => b.value_score - a.value_score);

    let saved = 0;
    let dbNote = '';
    if (keepers.length && supabaseConfigured()) {
      const rows = keepers.map((i) => ({
        platform: platform || 'other',
        thread_url: sourceUrl || null,
        thread_snippet: (tweetContent || '').slice(0, 280),
        handle: i.handle,
        quote: i.quote,
        bucket: i.bucket,
        value_score: i.value_score,
        sellable_fix: i.sellable_fix,
        existing_app: i.existing_app || null,
        who_pays: i.who_pays,
        draft_reply: i.draft_reply,
        dedupe_key: createHash('sha256').update(`${sourceUrl || ''}|${i.handle}|${i.quote}`).digest('hex'),
      }));
      const inserted = await db('tweetminer_leads?on_conflict=dedupe_key', {
        method: 'POST',
        body: rows,
        prefer: 'resolution=ignore-duplicates,return=representation',
      });
      saved = inserted?.length || 0;
    } else if (keepers.length) {
      dbNote = 'Lead list not connected yet, so nothing was saved.';
    }

    return res.status(200).json({
      leads: keepers,
      counts: { replies: all.length, valuable: keepers.length, saved, skipped: all.length - keepers.length },
      dbNote,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
