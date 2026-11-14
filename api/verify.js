import { isAuthed } from './_lib.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body || {};
  return res.status(200).json({ valid: isAuthed(token) });
}
