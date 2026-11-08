// Saved leads: list them, update status/notes, or delete one.
import { isAuthed, db, supabaseConfigured } from './_lib.js';

const STATUSES = ['found', 'replied', 'answered', 'sold', 'dead'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { token, action, id, status, notes } = req.body || {};
  if (!isAuthed(token)) return res.status(401).json({ error: 'Please log in again.' });
  if (!supabaseConfigured()) return res.status(200).json({ leads: [], dbNote: 'Lead list not connected yet.' });

  try {
    if (action === 'update') {
      if (!id) return res.status(400).json({ error: 'Missing lead' });
      const patch = { updated_at: new Date().toISOString() };
      if (status !== undefined) {
        if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Bad status' });
        patch.status = status;
      }
      if (notes !== undefined) patch.notes = String(notes).slice(0, 2000);
      await db(`tweetminer_leads?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: patch });
      return res.status(200).json({ ok: true });
    }
    if (action === 'delete') {
      if (!id) return res.status(400).json({ error: 'Missing lead' });
      await db(`tweetminer_leads?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
      return res.status(200).json({ ok: true });
    }
    const leads = await db('tweetminer_leads?select=*&order=created_at.desc&limit=500');
    return res.status(200).json({ leads });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
