// Shared sign-in helpers. Files starting with "_" are not exposed as API routes on Vercel.
//
// The old token was base64("<time>-<password>"), which anyone could decode to read
// the site password, and /api/analyze never checked it. Now the token is
// "<issuedAt>.<signature>": it proves the holder knew the password without
// containing it, expires after 30 days, and /api/analyze refuses requests without it.
import crypto from 'node:crypto';

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function sign(issuedAt, password) {
  return crypto.createHmac('sha256', password).update(`tweetminer:${issuedAt}`).digest('hex');
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function passwordMatches(given, password) {
  return typeof given === 'string' && safeEqual(given, password);
}

export function makeToken(password, now = Date.now()) {
  return `${now}.${sign(now, password)}`;
}

export function tokenIsValid(token, password, now = Date.now()) {
  if (!token || !password || typeof token !== 'string') return false;
  const [issuedRaw, signature] = token.split('.');
  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt) || !signature) return false;
  if (now - issuedAt > MAX_AGE_MS || issuedAt - now > 60 * 1000) return false;
  return safeEqual(signature, sign(issuedAt, password));
}

export function tokenFromRequest(req) {
  const header = req.headers?.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}
