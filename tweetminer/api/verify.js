export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  const correctPassword = process.env.SITE_PASSWORD;

  if (!token || !correctPassword) {
    return res.status(200).json({ valid: false });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const isValid = decoded.endsWith(`-${correctPassword}`);
    return res.status(200).json({ valid: isValid });
  } catch (err) {
    return res.status(200).json({ valid: false });
  }
}
