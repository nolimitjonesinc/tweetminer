import crypto from 'node:crypto';
// Shared server helpers. Files starting with _ are not API routes on Vercel.

// Sign-in tokens.
// The old token was base64("<time>-<password>"): anyone holding it could decode it and
// read the site password. Now the token is "<issuedAt>.<signature>". It proves the holder
// knew SITE_PASSWORD without containing it, and it expires after 30 days.
// No new setting is needed: the signature is keyed on SITE_PASSWORD itself, so changing
// the password in Vercel also signs everyone out.
const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function signToken(issuedAt, password) {
  return crypto.createHmac('sha256', password).update(`tweetminer:${issuedAt}`).digest('hex');
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function passwordMatches(given, password = process.env.SITE_PASSWORD) {
  return typeof given === 'string' && !!password && safeEqual(given, password);
}

export function makeToken(password = process.env.SITE_PASSWORD, now = Date.now()) {
  return `${now}.${signToken(now, password)}`;
}

export function isAuthed(token, password = process.env.SITE_PASSWORD, now = Date.now()) {
  if (!token || !password || typeof token !== 'string') return false;
  const [issuedRaw, signature] = token.split('.');
  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt) || !signature) return false;
  if (now - issuedAt > TOKEN_MAX_AGE_MS || issuedAt - now > 60 * 1000) return false;
  return safeEqual(signature, signToken(issuedAt, password));
}

export function supabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Talks to the database with the server-only key. Never sent to the browser.
export async function db(path, { method = 'GET', body, prefer } = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      // Old-style keys (JWTs, start with "eyJ") also go in Authorization; new sb_secret_ keys must not
      ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Database error ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

export async function callClaude(apiKey, model, system, userContent, maxTokens = 16000, extra = {}) {
  const isSonnet5 = model.startsWith('claude-sonnet-5');
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };
  // Sonnet 5.5: if a safety check declines, retry automatically on a fallback model
  if (isSonnet5) headers['anthropic-beta'] = 'server-side-fallback-2026-07-01';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      // Haiku 5.5 thinks by default; keep the old no-thinking behavior for the cheap summary step
      ...(model.startsWith('claude-haiku-5') ? { thinking: { type: 'disabled' } } : {}),
      // Sonnet 5.5 thinks before answering; medium effort balances quality and speed
      ...(isSonnet5
        ? { output_config: { effort: 'medium', ...(extra.format ? { format: extra.format } : {}) }, fallbacks: 'default' }
        : {}),
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  const data = await response.json();

  if (data.error) throw new Error(data.error.message);
  if (data.stop_reason === 'refusal') throw new Error('The AI declined to analyze this content.');
  if (data.stop_reason === 'max_tokens') throw new Error('The answer was too long and got cut off. Try fewer replies.');

  // Thinking models return thinking blocks first; collect only the answer text
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  if (!text) throw new Error('The AI returned an empty answer. Try again.');
  return text;
}
