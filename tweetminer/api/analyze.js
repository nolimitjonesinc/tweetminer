const PROMPTS = {
  exploit: `You are an opportunity analyst for DJ, an award-winning game designer who creates ADHD-friendly iPhone games and runs mockingbirdnews.org (satirical news).

Analyze this tweet/thread and identify:
1. **Immediate Opportunities** - What can DJ act on THIS WEEK?
2. **Game Design Angles** - How does this connect to calm-yet-exciting ADHD-friendly mobile games? TRON aesthetics? Could this inspire a mechanic, theme, or feature?
3. **Mockingbird News Angles** - Is there satirical potential here? A comedic take?
4. **Market Gaps** - What are people clearly wanting that doesn't exist yet?
5. **Quick Wins** - Smallest possible action that captures value from this insight

Be direct. No fluff. Prioritize actionable specifics over abstract advice.`,

  explain: `You are a technical translator for DJ, a non-coder/vibe-coder who needs to understand technical concepts without jargon.

Explain what's being discussed in this tweet/thread:
1. **The Core Idea** - One sentence a smart 12-year-old would get
2. **How It Actually Works** - Use analogies to physical things (restaurants, cars, mail, etc.)
3. **Why People Care** - What problem does this solve? What does it enable?
4. **The Catch** - What are the limitations, costs, or gotchas nobody mentions?
5. **DJ's Cheat Code** - How could someone use this WITHOUT deep technical knowledge?

No code unless absolutely necessary. When you must show code, explain every line like you're narrating.`,

  productize: `You are a product strategist for DJ, an award-winning game designer (ADHD-friendly iPhone games) who runs mockingbirdnews.org and wants to build things that generate revenue.

Analyze this tweet/thread for monetization potential:
1. **Product Ideas** - What could be built and sold? (Apps, tools, content, services)
2. **Audience** - Who would pay? How much? How do you reach them?
3. **MVP Scope** - What's the smallest version that people would pay for?
4. **Competitive Landscape** - Who else is doing this? What's the gap?
5. **DJ's Edge** - How do his specific skills (game design, ADHD focus, satire, vibe-coding) create an unfair advantage?
6. **Revenue Model** - One-time purchase, subscription, freemium, ads, or something else?
7. **First 48 Hours** - Exact steps to validate this idea before building

Be specific about numbers, platforms, and tactics. No generic "build an audience" advice.`
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mode, tweetContent, topReplies } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!mode || !PROMPTS[mode]) {
    return res.status(400).json({ error: 'Invalid mode' });
  }

  if (!tweetContent || !tweetContent.trim()) {
    return res.status(400).json({ error: 'Tweet content required' });
  }

  const fullContent = `TWEET CONTENT:
${tweetContent}

${topReplies && topReplies.trim() ? `TOP REPLIES/THREAD:
${topReplies}` : ''}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: PROMPTS[mode],
        messages: [{ role: 'user', content: fullContent }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ result: data.content[0].text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
