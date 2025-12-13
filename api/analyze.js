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

const SUMMARIZE_PROMPT = `You are a reply analyst preparing context for a strategic opportunity finder. Extract EVERYTHING useful from these Twitter/X replies.

Output a thorough summary:

1. **Overall Sentiment** - Is the crowd excited, skeptical, frustrated, curious? What's the vibe?

2. **Key Themes** (2-5 themes) - What topics keep coming up? Be specific.

3. **Pain Points & Frustrations** - What problems are people expressing? What's broken or missing for them?

4. **Questions & Confusion** - What do people want to know? What don't they understand?

5. **Ideas & Suggestions** - Any novel insights, feature requests, or "someone should build X" moments?

6. **Skepticism & Counterarguments** - What pushback exists? What are the doubters saying?

7. **Expert Signals** - Any replies from people with clear expertise or credibility? What do they add?

8. **Use Cases Mentioned** - Specific examples of how people would use this or are using similar things?

9. **Notable Quotes** (3-5 direct quotes) - Capture the most insightful, passionate, or representative voices verbatim.

Be thorough. The next step is strategic analysis - give it rich material to work with.`;

async function callClaude(apiKey, model, system, userContent, maxTokens = 1500) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.content[0].text;
}

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

  try {
    let replySummary = '';

    // Stage 1: If there are replies, summarize them with Haiku (fast & cheap)
    if (topReplies && topReplies.trim()) {
      replySummary = await callClaude(
        apiKey,
        'claude-3-5-haiku-20241022',
        SUMMARIZE_PROMPT,
        `Here are the replies to analyze:\n\n${topReplies}`,
        1200
      );
    }

    // Stage 2: Main analysis with Sonnet (smart)
    const analysisInput = `TWEET CONTENT:
${tweetContent}

${replySummary ? `REPLY ANALYSIS (summarized from ${topReplies.split('\n\n').length} replies):
${replySummary}` : '(No replies provided)'}`;

    const result = await callClaude(
      apiKey,
      'claude-sonnet-4-5-20250929',
      PROMPTS[mode],
      analysisInput,
      2000
    );

    return res.status(200).json({
      result,
      meta: {
        repliesProcessed: topReplies ? topReplies.split('\n\n').length : 0,
        usedHaikuSummary: !!replySummary
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
