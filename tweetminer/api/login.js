import { makeToken, passwordMatches } from './_auth.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const correctPassword = process.env.SITE_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (passwordMatches(password, correctPassword)) {
    return res.status(200).json({ success: true, token: makeToken(correctPassword) });
  }

  return res.status(401).json({ success: false, error: 'Invalid password' });
}
