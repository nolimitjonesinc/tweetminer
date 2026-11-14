import { makeToken, passwordMatches } from './_lib.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!process.env.SITE_PASSWORD) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (passwordMatches(password)) {
    return res.status(200).json({ success: true, token: makeToken() });
  }

  return res.status(401).json({ success: false, error: 'Invalid password' });
}
