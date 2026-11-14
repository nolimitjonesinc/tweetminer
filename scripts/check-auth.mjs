// Plain checks for sign-in and the locked AI routes. Run: node scripts/check-auth.mjs
import assert from 'node:assert/strict';

process.env.SITE_PASSWORD = 'test-password';
process.env.ANTHROPIC_API_KEY = 'fake-key';
process.env.DJ_LOOP_URL = 'https://loop.example';
process.env.DJ_LOOP_INGEST_KEY = 'fake-loop-key';

const { isAuthed, makeToken, passwordMatches } = await import('../api/_lib.js');
const login = (await import('../api/login.js')).default;
const verify = (await import('../api/verify.js')).default;
const analyze = (await import('../api/analyze.js')).default;
const sendToLoop = (await import('../api/send-to-loop.js')).default;

function call(handler, body) {
  return new Promise((resolve) => {
    const res = {
      code: 200,
      status(c) { this.code = c; return this; },
      json(d) { resolve({ code: this.code, data: d }); return this; },
    };
    Promise.resolve(handler({ method: 'POST', body }, res));
  });
}

let fetchCalls = 0;
globalThis.fetch = async () => {
  fetchCalls++;
  return { ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text: 'ok' }], id: 'idea1' }), text: async () => '' };
};

let pass = 0;
async function check(name, fn) { await fn(); pass++; console.log('ok -', name); }

await check('right password logs in', async () => {
  const r = await call(login, { password: 'test-password' });
  assert.equal(r.code, 200);
  assert.ok(isAuthed(r.data.token));
});
await check('token does not contain the password', async () => {
  const r = await call(login, { password: 'test-password' });
  assert.ok(!r.data.token.includes('test-password'));
  assert.ok(!Buffer.from(r.data.token.split('.')[0] || '', 'base64').toString().includes('test-password'));
});
await check('wrong password refused', async () => {
  const r = await call(login, { password: 'nope' });
  assert.equal(r.code, 401);
  assert.equal(passwordMatches(undefined), false);
});
await check('old-style base64 token no longer accepted', async () => {
  const old = Buffer.from(`${Date.now()}-test-password`).toString('base64');
  assert.equal(isAuthed(old), false);
  const r = await call(verify, { token: old });
  assert.equal(r.data.valid, false);
});
await check('tampered token refused', async () => {
  const t = makeToken();
  assert.equal(isAuthed(t.slice(0, -1) + (t.endsWith('a') ? 'b' : 'a')), false);
});
await check('expired token refused', async () => {
  const t = makeToken('test-password', Date.now() - 31 * 24 * 60 * 60 * 1000);
  assert.equal(isAuthed(t), false);
});
await check('token from a different password refused', async () => {
  assert.equal(isAuthed(makeToken('other-password')), false);
});
await check('analyze refuses without a token and makes no AI call', async () => {
  fetchCalls = 0;
  const r = await call(analyze, { mode: 'exploit', tweetContent: 'hello' });
  assert.equal(r.code, 401);
  assert.equal(fetchCalls, 0);
});
await check('analyze refuses oversized input before any AI call', async () => {
  fetchCalls = 0;
  const r = await call(analyze, { token: makeToken(), mode: 'exploit', tweetContent: 'x'.repeat(60001) });
  assert.equal(r.code, 400);
  assert.equal(fetchCalls, 0);
});
await check('analyze works with a valid token', async () => {
  fetchCalls = 0;
  const r = await call(analyze, { token: makeToken(), mode: 'exploit', tweetContent: 'hello' });
  assert.equal(r.code, 200, JSON.stringify(r.data));
  assert.ok(fetchCalls >= 1);
});
await check('send-to-loop refuses without a token', async () => {
  fetchCalls = 0;
  const r = await call(sendToLoop, { title: 't', raw_input: 'x' });
  assert.equal(r.code, 401);
  assert.equal(fetchCalls, 0);
});
await check('send-to-loop works with a valid token', async () => {
  const r = await call(sendToLoop, { token: makeToken(), title: 't', raw_input: 'x' });
  assert.equal(r.code, 200);
});

console.log(`\n${pass}/12 passed`);
