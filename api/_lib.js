// Shared server helpers. Files starting with _ are not API routes on Vercel.

export function isAuthed(token) {
  const pw = process.env.SITE_PASSWORD;
  if (!token || !pw) return false;
  try {
    return Buffer.from(token, 'base64').toString('utf-8').endsWith(`-${pw}`);
  } catch {
    return false;
  }
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
