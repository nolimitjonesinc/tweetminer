export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const loopUrl = process.env.DJ_LOOP_URL
  const loopKey = process.env.DJ_LOOP_INGEST_KEY

  if (!loopUrl || !loopKey) {
    return res.status(500).json({ error: 'DJ Loop not configured' })
  }

  try {
    const { title, raw_input, source_url, analysis, platform } = req.body

    const response = await fetch(`${loopUrl}/api/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': loopKey,
      },
      body: JSON.stringify({
        title: title || 'TweetMiner Idea',
        raw_input,
        input_type: 'tweet',
        project_dna: 'utility-app',
        source_url,
        source: 'tweetminer',
        analysis: { productize_result: analysis, platform },
        auto_generate_prd: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Failed to send to DJ Loop' })
    }

    return res.status(200).json({ success: true, ideaId: data.id })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to DJ Loop' })
  }
}
