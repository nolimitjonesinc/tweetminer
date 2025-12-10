export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.SITE_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (password === correctPassword) {
    // Create a simple token (in production, use JWT or similar)
    const token = Buffer.from(`${Date.now()}-${correctPassword}`).toString('base64');
    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ success: false, error: 'Invalid password' });
}
